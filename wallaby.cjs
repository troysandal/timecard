module.exports = function (wallaby) {
    return {
      files: [
        'src/**/*.ts',
        'test/fixtures/**/*.json'
      ],

      compilers: {
        '**/*.ts': wallaby.compilers.typeScript({ module: 'commonjs' })
      },

      tests: [
        'test/specs/**/test.*.ts'
      ],
      env: {
        type: 'node',
        runner: 'node'
      },
      testFramework: 'mocha'
    };
  };