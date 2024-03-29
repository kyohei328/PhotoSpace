class Api::V1::PhotosController < ApplicationController
  require 'mini_exiftool'
  require 'exifr/jpeg'

  before_action :authenticate, only: %i[create update destroy likes]
  skip_before_action :set_auth, only: %i[index latest]

  def index
    page = params[:page] || 1
    per_page = params[:per_page] || 10

    @q = Photo.ransack(params[:q])
    @photos = @q.result(distinct: :true).order(created_at: :desc).page(page).per(per_page).includes(:user, :likes, :category)
    photos = @q.result(distinct: :true).order(created_at: :desc).includes(:user, :likes, :category)
    categories = Category.all

    render json:  {
      photos: @photos.map { |photo|
        {
          id: photo.id,
          title: photo.title,
          image_url: image_url(photo),
          lat: photo.gps_latitude,
          lng: photo.gps_longitude,
          user_name: photo.user&.name,
          created_at: photo.created_at,
          likes_count: photo.likes.count,
        }
      },
      photo_count: photos.count,
      categories: categories.map { |category|
        category.name
      },
    }
  end

  def create
    photo = @current_user.photos.build(photo_params)
    add_Exif_to_photo(photo, params[:photo][:photo_img])
    add_category(photo, params[:photo][:category])

    if photo.save
      render json: photo
    else
      render json: { errors: photo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    photo = Photo.find(params[:id])
    render json: { photo: photo.as_json(include: [:user, :category]), photo_url: image_url(photo) }
  end

  def update; end

  def destroy
    photo = Photo.find(params[:id])
    photo.photo_img.purge if photo.photo_img.attached?
    photo.destroy
  end

  def likes
    photo = Photo.find(params[:photo_id])
    like_stauts = @current_user.like?(photo)
    like = Like.find_by(photo: photo, user: @current_user)

    if like
      render json: { like_stauts: like_stauts, like_id: like.id }
    else
      render json: { like_stauts: like_stauts, like_id: nil }
    end

  end

  def latest
    photo = Photo.last
    render json: photo
  end

  private

  def photo_params
    params.require(:photo).permit(:title, :description, :photo_img)
  end

  def add_category(photo, category_params)
    category = Category.find_by(name: category_params)

    photo.assign_attributes(
      category_id: category.id
    )

  end

  def add_Exif_to_photo(photo, uploard_image)

    tempfile = Tempfile.new
    tempfile.binmode
    tempfile.write(uploard_image.read)
    tempfile.rewind
    exif = MiniExiftool.new(tempfile)

    tempfile.rewind
    exif_data = EXIFR::JPEG.new(tempfile)

    tempfile.close
    tempfile.unlink

    if exif_data.gps.present?
      latitude = exif_data.gps.latitude
      longitude = exif_data.gps.longitude
    else
      latitude = nil
      longitude = nil
    end

    photo.assign_attributes(
      gps_latitude: latitude,
      gps_longitude: longitude,
      camera_make: exif.Make,
      camera: exif.Model,
      lens_make: exif.LensMake,
      lens: exif.Lens,
      ISO_sensitivity: exif.ISO,
      shutter_speed: exif.ExposureTime,
      exposure_compensation: exif.ExposureCompensation,
      aperture: exif.FNumber,
      focal_length: exif.FocalLength,
      white_balance: exif.WhiteBalance,
      shooting_mode: exif.ExposureMode,
      image_size_width: exif.ImageWidth,
      image_size_height: exif.ImageHeight
    )
  end

  def image_url(photo)
    if photo.respond_to?(:photo_img) && photo.photo_img.attached?
      rails_blob_url(photo.photo_img)
    else
      nil
    end
  end

end
