/*
 The file contents for the current environment will overwrite these during build.
 The build system defaults to the dev environment which uses `environment.ts`, but if you do
 `ng build --env=prod` then `environment.prod.ts` will be used instead.
 The list of which env maps to which file can be found in `.angular-cli.json`.
 http://tattoocoder.com/angular-cli-using-the-environment-option/
 */

export const environment = {
  production: false,
  envName: 'dev',
  ALL_HEROES_URL: 'http://localhost:8080/webflow/api/heroes',
  INIT_ADD_URL: 'http://localhost:8080/webflow/api/initAddhero',
  HEROES_TREE_URL: 'http://localhost:8080/webflow/api/tree',
  ALL_MESSAGES_URL: 'http://localhost:8080/webflow/api/metadata/messages',
  VALIDATION_METADATA_URL: 'http://localhost:8080/webflow/api/metadata/validation',
  VALIDATE_FIELD_URL: 'http://localhost:8080/webflow/api/validateField',
  VALIDATE_ALL_FIELD_URL: 'http://localhost:8080/webflow/api/validateAllFields',
  HERO_URL: 'http://localhost:8080/webflow/api/hero',
  SAVE_ENEMY_URL: 'http://localhost:8080/webflow/api/saveEnemies',
  SAVE_HERO_URL: 'http://localhost:8080/webflow/api/saveHero',
  LOGIN_URL: 'http://localhost:8080/webflow/api/doLogin',
  UPDATE_CHART_DATA: 'http://localhost:8080/webflow/api/updateData',
  WEB_SOCKET_HOST_URL: 'http://localhost:8080/webflow/chartData',
  HERO_CHILD_NODES_URL: 'http://localhost:8080/webflow/api/children',
  INIT_BOOKING_URL: 'http://localhost:8080/webflow/api/booking/v1/init',
  SAVE_BOOKING_URL: 'http://localhost:8080/webflow/api/booking/v1/',
  INIT_ACCOUNT_URL: 'http://localhost:8080/webflow/api/account/init',
  SAVE_ACCOUNT_URL: 'http://localhost:8080/webflow/api/account',
  INIT_ROLE_URL: 'http://localhost:8080/webflow/api/role/init',
  SAVE_ROLE_URL: 'http://localhost:8080/webflow/api/role',
  SAVE_EVENT_URL: 'http://localhost:8080/webflow/api/event/v1/',
  NEARBY_EVENTS_URL: 'http://localhost:8080/webflow/api/event/v1/nearbyevents',
  INIT_EVENT_URL: 'http://localhost:8080/webflow/api/event/v1/init',
  INIT_ARTIST_URL: 'http://localhost:8080/webflow/api/artist/v1/init',
  SAVE_ARTIST_URL: 'http://localhost:8080/webflow/api/artist/v1/',
  ARTIST_PERSON_URL: 'http://localhost:8080/webflow/api/artist/v1/person',
  SEND_CHAT_URL: 'http://localhost:8080/webflow/api/chats',
  CHAT_WEB_SOCKET_HOST_URL: 'http://localhost:8080/webflow/chat'
};
