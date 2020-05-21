module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: [
        'js',
        'ts'
    ],
    rootDir: "src",
    testMatch: [
        '**/tests/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node'
}