import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import boundariesPlugin from 'eslint-plugin-boundaries';

const FS_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const FS_SEGMENTS = ['ui', 'model', 'lib', 'api', 'config', 'assets'];

const getLowerLayers = (layer) => FS_LAYERS.slice(FS_LAYERS.indexOf(layer) + 1);
const getUpperLayers = (layer) => FS_LAYERS.slice(0, FS_LAYERS.indexOf(layer));

const FS_SLICED_LAYERS_REG = getUpperLayers('shared').join('|');
const FS_SEGMENTS_REG = [...FS_SEGMENTS, ...FS_SEGMENTS.map((seg) => `${seg}.*`)].join('|');

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      import: importPlugin,
      boundaries: boundariesPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      'boundaries/elements': [
        ...FS_LAYERS.map((layer) => ({
          type: layer,
          pattern: `${layer}/!(_*){,/*}`,
          mode: 'folder',
          capture: ['slices'],
        })),
        ...FS_LAYERS.map((layer) => ({
          type: `gm_${layer}`,
          pattern: `${layer}/_*`,
          mode: 'folder',
          capture: ['slices'],
        })),
      ],
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      'import/no-internal-modules': ['error', {
        allow: [
          `**/*(${FS_SLICED_LAYERS_REG})/!(${FS_SEGMENTS_REG})`,
          `**/*(${FS_SLICED_LAYERS_REG})/!(${FS_SEGMENTS_REG})/!(${FS_SEGMENTS_REG})`,
          `**/*shared/*(${FS_SEGMENTS_REG})/!(${FS_SEGMENTS_REG})`,
          `**/*shared/*(${FS_SEGMENTS_REG})`,
          `**/node_modules/**`,
          `**/*shared/_*`,
          `**/*shared/_*/*`,
          `**/*.css`,
        ],
      }],

      'boundaries/dependencies': [2, {
        default: 'disallow',
        message: '{{from.type}} is not allowed to import {{to.type}}',
        rules: [
          ...getUpperLayers('shared').map((layer) => ({
            from: { type: layer },
            allow: [{ to: { type: layer } }, ...getLowerLayers(layer).map((l) => ({ to: { type: l } }))],
          })),
          { from: { type: 'shared' }, allow: [{ to: { type: 'shared' } }] },
          ...FS_LAYERS.map((layer) => ({
            from: { type: `gm_${layer}` },
            allow: [{ to: { type: layer } }, ...getLowerLayers(layer).map((l) => ({ to: { type: l } }))],
          })),
        ],
      }],

      'import/order': [2, {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: FS_LAYERS.map((layer) => ({
          pattern: `**/?(*)${layer}{,/**}`,
          group: 'internal',
          position: 'after',
        })),
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      }],
    },
  },
]);
