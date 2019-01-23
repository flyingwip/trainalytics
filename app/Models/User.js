'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  setStravaTokens(tokens){

    this.strava_authorized = 1;
    this.strava_token_expires_at = tokens.expires_at;
    this.strava_token_expires_in = tokens.expires_in;
    this.strava_token_access_token = tokens.access_token;
    this.strava_token_refresh_token = tokens.refresh_token;
    this.save();

    return

  }

  getStravaTokens(){

    let tokens = { token_type: 'Bearer',
      expires_at: this.strava_token_expires_at,
      expires_in: this.strava_token_expires_in,
      refresh_token: this.strava_token_refresh_token,
      access_token: this.strava_token_access_token,
    }

    return tokens;
  }
}

module.exports = User
