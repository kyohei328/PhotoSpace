class Api::V1::ContestsController < ApplicationController

  before_action :authenticate, only: %i[create update destroy]

  skip_before_action :set_auth, only: %i[index latest]

  def index

  end

  def create
    contest = @current_user.contests.build(contest_params)
    if contest.save
      render json: contest
    else
      render json: { errors: contest.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update

  end

  def destroy

  end

  def latest
    contest = Contest.last
    render json: contest
  end

  private

  def contest_params
    params.require(:contest).permit(:title, :description, :start_date, :end_date, :result_date, :entry_conditions, :department)
  end
end