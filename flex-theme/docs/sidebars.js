/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['intro', 'installation', 'usage'],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: ['concepts/themes', 'concepts/tokens', 'concepts/i18n'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/core',
        'api/react',
        'api/vue',
        'api/angular',
        'api/tailwind',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/index',
        'components/button',
        'components/card',
        'components/input',
        'components/checkbox',
        'components/switch',
        'components/modal',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/customization',
        'guides/ssr',
        'guides/animations',
        'guides/accessibility',
      ],
    },
  ],
};

module.exports = sidebars;
