export const GAME_CONFIG = {
  // Camera
  CAMERA_FOV: 60,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_Z: 8,

  // Assets
  BACKGROUND_IMAGE: 'assets/imgs/market.jpg',
  PLAYER_MODEL: 'assets/models/market_cart.glb',
  SCREAMER_IMAGE: 'assets/imgs/tornado-guy.png',
  WIFE_IMAGE: 'assets/imgs/woman.png',
  SCREAMER_SOUND: 'assets/sound/no-no-wait-wait.mp3',

  // Player
  PLAYER_Y: -4.0,
  PLAYER_BOUNDS_X: 4,

  // Spawning / falling items
  SPAWN_INTERVAL_MS: 1500,
  FALL_SPEED: 0.08,
  ITEM_TARGET_SIZE: 0.8,
  OUT_OF_BOUNDS_Y: -5.5,

  // Game rules
  INITIAL_LIVES: 3,

  // Screamer UI/audio
  SCREAMER_DURATION_MS: 1000,
  SCREAMER_SOUND_PLAY_SECONDS: 3
} as const;

export const CLOTHING_ASSET_PATHS: readonly string[] = [
  'assets/models/clothes/aesthetic_cute_white_socks.glb',
  'assets/models/clothes/blue_dress.glb',
  'assets/models/clothes/blue_jeans_pants.glb',
  'assets/models/clothes/cat_cap.glb',
  'assets/models/clothes/crosby_zebrawood.glb',
  'assets/models/clothes/dress-plain2.glb',
  'assets/models/clothes/shorts_pants.glb',
  'assets/models/clothes/small_tank_top_white.glb',
  'assets/models/clothes/t-shirt.glb',
  'assets/models/clothes/womens_shirt.glb'
];
