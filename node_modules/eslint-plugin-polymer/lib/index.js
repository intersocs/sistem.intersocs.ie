/**
 * @fileoverview Polymer related configs
 * @author Michael Stramel
 */

/* eslint-env node */

// ----------------------------------------------------------------------------
// Plugin Definition
//
// 2 == 'error', 1 == 'warning', 0 == 'off'
// ----------------------------------------------------------------------------

module.exports = {
  configs: {
    'polymer-1': {
      extends: ['eslint:recommended', 'google'],
      env: {
        browser: true
      },
      plugins: ['html'],
      rules: {},
      settings: {
        'html/indent': '+2',
        'html/report-bad-indent': 2
      },
      globals: {
        Polymer: false,
        Promise: false
      }
    },
    'polymer-2': {
      extends: ['eslint:recommended', 'google'],
      env: {
        browser: true,
        es6: true
      },
      plugins: ['html'],
      rules: {
        'new-cap': [
          2,
          {
            capIsNewExceptionPattern: 'Mixin$'
          }
        ]
      },
      settings: {
        'html/indent': '+2',
        'html/report-bad-indent': 2
      },
      globals: {
        customElements: false,
        Polymer: false
      }
    },
    'polymer-3': {
      extends: ['eslint:recommended', 'google'],
      env: {
        browser: true,
        es6: true
      },
      parserOptions: {
        sourceType: 'module'
      },
      rules: {
        'new-cap': [
          2,
          {
            capIsNewExceptionPattern: 'Polymer|Mixin$'
          }
        ],
        'no-useless-constructor': 2
      },
      globals: {
        customElements: false,
        Polymer: false
      }
    }
  }
};
