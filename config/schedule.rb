# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
# every 1.day, at: '00:00 am' do
#   rake 'pickup_today_photos'
# end

# job_type :rake, "cd :path && :environment_variable=:environment bundle exec rake :task --silent :output"

# rbenvを初期化
set :job_template, "/bin/zsh -l -c ':job'"
job_type :rake_task, "export PATH=\"$HOME/.rbenv/bin:$PATH\"; eval \"$(rbenv init -)\"; cd :path && bundle exec rake :task :environment_variable=:environment --silent :output"

# Rails.rootを使用するために必要
require File.expand_path(File.dirname(__FILE__) + '/environment')

# cronを実行する環境変数
rails_env = ENV['RAILS_ENV'] || :development

# cronを実行する環境変数をセット
set :environment, rails_env

# cronのログの吐き出し場所
set :output, "#{Rails.root}/log/cron.log"

# every 1.minute do
#   rake_task 'pickup_today_photos:execute'
# end
every 1.day, at: '0:00 am' do
  rake_task 'pickup_today_photos:execute'
end