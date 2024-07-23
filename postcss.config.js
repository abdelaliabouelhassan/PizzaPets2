import purgecss from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import tailwindcss from 'tailwindcss'

const purgeCSSConfig = purgecss({
  content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.jsx', './src/**/*.js'],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  safelist: [
    'body', // add the body class to the safelist
    /^Minimal3x5$/ // ensure your custom font family class is not purged
  ]
})

const plugins = [
  tailwindcss,
  autoprefixer,
  // Add CSSNano for CSS minification
  cssnano({
    preset: 'default'
  })
]

// eslint-disable-next-line no-undef
if (process.env.VITE_NETWORK === 'mainnet') {
  plugins.push(purgeCSSConfig)
}

export default {
  plugins
}
