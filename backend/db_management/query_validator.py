"""
Query validator for safe, read-only query execution
"""

import re
import logging
from typing import Tuple

logger = logging.getLogger(__name__)


class QueryValidator:
    """
    Validates SQL queries to ensure they are safe and read-only
    """
    
    # Blacklisted SQL keywords that modify data
    BLACKLISTED_KEYWORDS = [
        'drop', 'delete', 'truncate', 'alter', 'update', 'insert',
        'create', 'grant', 'revoke', 'exec', 'execute', 'call',
        'merge', 'replace', 'load', 'copy', 'import', 'export'
    ]
    
    # Whitelisted keywords (SELECT only operations)
    ALLOWED_KEYWORDS = ['select', 'with', 'union', 'except', 'intersect']
    
    # Maximum query length
    MAX_QUERY_LENGTH = 10000
    
    # Maximum execution time in seconds
    MAX_EXECUTION_TIME = 5
    
    @staticmethod
    def is_safe(query: str) -> Tuple[bool, str]:
        """
        Check if a query is safe to execute (read-only)
        
        Args:
            query: SQL query string
            
        Returns:
            Tuple of (is_safe: bool, error_message: str)
        """
        if not query or not query.strip():
            return False, "Query cannot be empty"
        
        # Check query length
        if len(query) > QueryValidator.MAX_QUERY_LENGTH:
            return False, f"Query exceeds maximum length of {QueryValidator.MAX_QUERY_LENGTH} characters"
        
        # Normalize query for checking
        query_lower = query.lower().strip()
        
        # Remove comments
        query_lower = re.sub(r'--.*', '', query_lower)  # Single-line comments
        query_lower = re.sub(r'/\*.*?\*/', '', query_lower, flags=re.DOTALL)  # Multi-line comments
        
        # Check for blacklisted keywords
        for keyword in QueryValidator.BLACKLISTED_KEYWORDS:
            # Use word boundaries to avoid false positives
            pattern = r'\b' + re.escape(keyword) + r'\b'
            if re.search(pattern, query_lower):
                return False, f"Query contains forbidden keyword: {keyword.upper()}. Only SELECT queries are allowed."
        
        # Check that query starts with SELECT or WITH (CTE)
        query_start = query_lower.strip()
        if not any(query_start.startswith(kw) for kw in QueryValidator.ALLOWED_KEYWORDS):
            return False, "Query must start with SELECT or WITH. Only read-only queries are allowed."
        
        # Check for SQL injection patterns
        dangerous_patterns = [
            r';\s*(drop|delete|truncate|alter|update|insert|create)',
            r'union\s+.*\s+select',
            r'exec\s*\(',
            r'execute\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, query_lower, re.IGNORECASE):
                return False, "Query contains potentially dangerous patterns"
        
        return True, ""
    
    @staticmethod
    def validate_and_limit(query: str, max_rows: int = 1000) -> str:
        """
        Validate query and add LIMIT clause if not present
        
        Args:
            query: SQL query string
            max_rows: Maximum number of rows to return
            
        Returns:
            Modified query with LIMIT clause
        """
        is_safe, error = QueryValidator.is_safe(query)
        if not is_safe:
            raise ValueError(error)
        
        query_lower = query.lower()
        
        # Check if LIMIT already exists
        if 'limit' in query_lower:
            # Extract existing limit value and ensure it's not too high
            limit_match = re.search(r'limit\s+(\d+)', query_lower)
            if limit_match:
                existing_limit = int(limit_match.group(1))
                if existing_limit > max_rows:
                    # Replace with max_rows
                    query = re.sub(
                        r'limit\s+\d+',
                        f'LIMIT {max_rows}',
                        query,
                        flags=re.IGNORECASE
                    )
        else:
            # Add LIMIT clause
            # Find the end of the query (before any semicolons)
            query = query.rstrip(';').strip()
            query += f' LIMIT {max_rows}'
        
        return query

