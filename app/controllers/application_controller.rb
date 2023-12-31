class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include Api::V1::FirebaseAuthConcern

  before_action :set_auth
  # before_action :authenticate

  # def authenticate(set_auth)
  #   uid = @auth[:data][:uid]
  #   @current_user = User.find_by!(uid: uid)
  # rescue => e
  #   logger.error "Error in authenticate_user: #{e.message}"
  #   render json: { error: 'Not Authorized' }, status: :unauthorized
  # end
  

  def authenticate
    # binding.pry
    uid = @auth[:data][:uid]
    @current_user = User.find_by!(uid: uid)
  rescue => e
    logger.error "Error in authenticate_user: #{e.message}"
    render json: { error: 'Not Authorized' }, status: :unauthorized
  end

  private

  def form_authenticity_token; end

  def set_auth
    # binding.pry
    @auth = authenticate_token_by_firebase
  end

end