SELECT properties.*, AVG(property_reviews.rating) AS average_reviews FROM properties
  JOIN property_reviews ON property_id = properties.id
  WHERE 1=1
   AND city LIKE '%ancouv%' OR NOT NULL AND cost_per_night > 0 AND cost_per_night < 100000
GROUP BY properties.id
HAVING AVG(property_reviews.rating) > 3
ORDER BY properties.id
LIMIT 10;
