$:.push File.expand_path("../lib", __FILE__)

require "govuk_frontend_toolkit/version"

Gem::Specification.new do |s|
  s.name         = "govuk_frontend_toolkit"
  s.version      = GovUKFrontendToolkit::VERSION

  s.add_dependency "rails", ">= 3.1.0"
  s.add_development_dependency "gem_publisher", "~> 1.1.1"
  s.add_development_dependency "rake", "0.9.2.2"
  s.add_development_dependency "gemfury", "0.4.8"

  s.require_path = 'lib'
end
