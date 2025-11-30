import { getMySqlConnection } from '../connections.js';

export async function prepareGameInfoSchema() {
  const conn = await getMySqlConnection();

  await conn.query(`
    CREATE TABLE IF NOT EXISTS game_info (
      steam_appid INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      short_description TEXT,
      detailed_description TEXT,
      is_free BOOLEAN,
      platform_windows BOOLEAN,
      platform_mac BOOLEAN,
      platform_linux BOOLEAN,
      header_image TEXT,
      capsule_image TEXT,
      blur_image TEXT,
      website TEXT,
      controller_support ENUM('full','partial'),
      about_the_game TEXT,
      supported_languages TEXT,
      background TEXT,
      required_age INT,
      pc_minimum TEXT,
      pc_recommended TEXT,
      mac_minimum TEXT,
      mac_recommended TEXT,
      linux_minimum TEXT,
      linux_recommended TEXT,
      release_coming_soon BOOLEAN,
      release_date DATETIME,
      app_url TEXT,
      price_currency VARCHAR(10),
      price_initial INT,
      price_final INT,
      price_initial_formatted VARCHAR(50),
      price_final_formatted VARCHAR(50),
      price_discount_percent INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS game_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      appid INT NOT NULL,
      category_id INT,
      description TEXT,
      FOREIGN KEY (appid) REFERENCES game_info(steam_appid)
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS game_genres (
      id INT AUTO_INCREMENT PRIMARY KEY,
      appid INT NOT NULL,
      genre_id INT,
      description TEXT,
      FOREIGN KEY (appid) REFERENCES game_info(steam_appid)
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS game_screenshots (
      id INT AUTO_INCREMENT PRIMARY KEY,
      appid INT NOT NULL,
      screenshot_id INT,
      path_thumbnail TEXT,
      path_full TEXT,
      FOREIGN KEY (appid) REFERENCES game_info(steam_appid)
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS game_movies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      appid INT NOT NULL,
      movie_id INT,
      name VARCHAR(255),
      thumbnail TEXT,
      webm_480 TEXT,
      webm_max TEXT,
      mp4_480 TEXT,
      mp4_max TEXT,
      highlight BOOLEAN,
      FOREIGN KEY (appid) REFERENCES game_info(steam_appid)
    );
  `);
  console.log('✅ GameInfo schema prepared.');
}