const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'travisliu',
  password: '123',
  database: 'lightbnb',
  host: 'localhost',
  port: '5432'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`SELECT * FROM users
  WHERE email = $1;`, [email])
    .then((result) => {
      if (!result) return null;
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
    SELECT * FROM USERS
    WHERE id = $1
  `, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

  return pool.query(`
    INSERT INTO users (name,email,password)
    VALUES ($1,$2,$3)
    RETURNING *;
  `, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.id, properties.thumbnail_photo_url, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

// -------------------------------------------------- BOOK RESERVATIONS
const addReservation = function (reservationDetails) {
  let queryParams = [];
  for (let key in reservationDetails) {
    queryParams.push(reservationDetails[key]);
  }
  return pool.query(`
    INSERT INTO reservations (property_id,start_date, end_date,guest_id)
    VALUES($1,$2,$3,$4)
    RETURNING *;
  `, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addReservation = addReservation;

// CREATE TABLE reservations (
//   id SERIAL PRIMARY KEY NOT NULL,
//   start_date DATE NOT NULL,
//   end_date DATE NOT NULL,
//   property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
//   guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  let queryParameters = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating FROM properties
  JOIN property_reviews ON property_id = properties.id
  WHERE 1=1
  `;

  if (options.city) {
    queryParameters.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParameters.length}`;
  }

  if (options.owner_id) {
    queryParameters.push(options.owner_id);
    queryString += ` AND owner_id = $${queryParameters.length}`;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParameters.push(options.minimum_price_per_night * 100);
    queryParameters.push(options.maximum_price_per_night * 100);
    queryString += ` AND cost_per_night > $${queryParameters.length - 1} AND cost_per_night < $${queryParameters.length}`;
  }
  queryString += ` GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParameters.push(options.minimum_rating);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParameters.length}`;
  }



  // console.log(queryString, queryParameters);
  return pool.query(`
  ${queryString}
  ORDER BY properties.id
  LIMIT ${limit};
  `, queryParameters).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  console.log(property);
  let insertValues = [];
  for (let key in property) {
    insertValues.push(property[key]);
  }
  console.log(insertValues);
  return pool.query(`
    INSERT INTO properties (
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
      owner_id
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14
    )
      RETURNING *;
    `, insertValues)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};


exports.addProperty = addProperty;


// // Property
// {
//   owner_id: int,
//   title: string,
//   description: string,
//   thumbnail_photo_url: string,
//   cover_photo_url: string,
//   cost_per_night: string,
//   street: string,
//   city: string,
//   province: string,
//   post_code: string,
//   country: string,
//   parking_spaces: int,
//   number_of_bathrooms: int,
//   number_of_bedrooms: int
// }