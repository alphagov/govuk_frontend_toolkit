lib = File.expand_path("../lib", __FILE__)
$:.unshift lib unless $:.include?(lib)

require "rake"

require "gem_publisher"
task :publish_gem do |t|
  gem = GemPublisher.publish_if_updated("govuk_frontend_toolkit.gemspec", :gemfury)
  puts "Published #{gem}" if gem
end

task :test do |t|
  true
end

task :default => :test
