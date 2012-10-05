$:.push File.expand_path("../lib", __FILE__)

require "govuk_frontend_toolkit/version"

Gem::Specification.new do |s|
  s.name         = "govuk_frontend_toolkit"
  s.version      = GovUKFrontendToolkit::VERSION
  s.summary      = 'Tools for building frontend applications'
  s.authors      = ['Bradley Wright']
  s.email        = 'bradley.wright@digital.cabinet-office.gov.uk'
  s.homepage     = 'https://github.com/alphagov/govuk_frontend_toolkit'

  s.add_dependency "rails", ">= 3.1.0"
  s.add_dependency "sass", ">= 3.2.0"
  s.add_development_dependency "gem_publisher", "~> 1.1.1"
  s.add_development_dependency "rake", "0.9.2.2"
  s.add_development_dependency "gemfury", "0.4.8"

  s.require_paths = ["lib", "app"]
  s.files         = `git ls-files`.split($\)
end
