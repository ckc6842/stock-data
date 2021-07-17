module.exports = {
    transform: {
        '\\.[jt]s$': 'babel-jest',
        '\\.html$': '<rootDir>/module/raw-loader.js'
    }
}