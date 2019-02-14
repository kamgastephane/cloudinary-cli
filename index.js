#!/usr/bin/env node

/**
 * Module dependencies
*/

const file = require('./config/file')
const upload = require('./config/upload')
const search = require('./config/search')
const update = require('./config/update')
const deleteFile = require('./config/delete')
const createTransform = require('./config/transform')
const program = require('commander')
const {prompt} = require('inquirer')

/**
 * setting questions for env file
*/

const questionEnv = [
  {
    type: 'input',
    name: 'CLOUD_NAME',
    message: 'Please enter your cloud name',
    validate: function (value) {
      if (!value) {
        return 'Please enter your cloud name'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'API_KEY',
    message: 'Please enter your API key',
    validate: function (value) {
      if (!value) {
        return 'Please enter your API key'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'API_SECRET',
    message: 'Please enter your API secret',
    validate: function (value) {
      if (!value) {
        return 'Please enter your API secret'
      }
      return true
    }
  }]

/**
* Confirm question before delete
*/

const questionDelete = [{
  type: 'confirm',
  name: 'delete',
  message: 'Are you sure you wanna delete this file ?',
  default: false
}]

/**
  * setting command to set env file
*/

program
  .command('env')
  .alias('e')
  .description('Set your env file')
  .action(() => {
    prompt(questionEnv).then(answers => {
      file(answers)
    })
  })

  /**
   * setting command to upload file
   * @param {String} file
   * @param {any} next
  */

program
  .command('upload <file>')
  .alias('u')
  .description('Upload file(s)')
  .option('-f, --folder <folder>', 'upload to the following folder on cloudinary')
  .option('-a, --array', 'Upload more than 1 file')
  .action((file, options, next) => {
    var uploadOptions = {}
    if (options.folder) {
      uploadOptions.folder = options.folder
    }
    if (options.array) {
      const array = []
      array.push(file, program.args)
      const files = array.toString().split(',')
      upload(files, next, uploadOptions)
    } else {
      upload([file], next, uploadOptions)
    }
    console.log('Uploading...')
  })

/**
* Setting command to list files
* @param {String} options
*/

program
  .command('list')
  .alias('s')
  .description('Search file(s) and list them')
  .option('-a, --all', 'get all files')
  .option('-s, --search <file>', 'Search file by publicID')
  .option('-t, --type <tag>', 'Search by type. <tag> can be <image> or <gif>')
  .action((options) => {
    if (options.all) {
      search.listAll()
    } else if (options.search) {
      search.searchPublicId(options.search)
    } else if (options.type) {
      search.searchType(options.type)
    }
  })

/**
* Setting command to rename public_id
* @param {String} publicIdOld
* @param {String} publicIdNew
*/

program
  .command('rename <publicIdOld> <publicIdNew>')
  .alias('r')
  .description('Remane your public_id')
  .action((publicIdOld, publicIdNew) => {
    update(publicIdOld, publicIdNew)
  })

  /**
  * Setting command to delete file permanently
  * @param {String} publicId
  * @param {String} options
  */

program
  .command('delete <publicId>')
  .alias('d')
  .description('Delete your file(s)')
  .option('-a, --array', 'Delete more than 1 file')
  .action((publicId, options, next) => {
    prompt(questionDelete).then(answers => {
      if (answers.delete === true) {
        if (options.array) {
          const array = []
          array.push(publicId, program.args)
          const files = array.toString().split(',')
          deleteFile(files, next)
        } else {
          deleteFile([publicId], next)
        }
        console.log('Deleting...')
      }
    })
  })

  /**
  * Setting command to create a transformation
  * @param {String} name:parameters
  *  e.g. $ cloudTool transform small_fill w_150,h_100,c_fill
  */
program
  .command('transform <name> <parameters>')
  .alias('t')
  .description('create a transformation')
  .action((name, parameters, next) => {
    if (name && parameters) {
      createTransform(name, parameters, next)
    } else {
      console.log('name and parameter should be defined!')
    }
    console.log('Creating transformation...')
  })

program.parse(process.argv)
