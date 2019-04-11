/*
 * Create and export configuration variables
 */

 // Container for all the env
 const environments = {}

 // Staging object (default) environment
 environments.staging = {
    'port':3000,
    'envName': 'staging'
 };

 // Production environment
 environments.production = {
    'port': 3000,
    'envName': 'production'
 };

 // Determine which env to export out as a CL argument
 const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

 // check that the current env is one of the above or return default
 const environmentToExport = typeof(environments[currentEnvironment]) == 'object'? environments[currentEnvironment] : environments.staging;

 // export modul
 module.exports = environmentToExport;
