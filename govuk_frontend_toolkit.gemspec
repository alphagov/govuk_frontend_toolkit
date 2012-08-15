$:.push File.expand_path("../lib", __FILE__)

require "govuk_frontend_toolkit/version"

Gem::Specification.new do |s|
  s.name         = "govuk_frontend_toolkit"
  s.version      = GovUKFrontendToolkit::VERSION

  s.add_dependency "rails", ">= 3.1.0"

  s.require_path = 'lib'
end
