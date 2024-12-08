export function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return ""
    } else {
        return "http://localhost:" + process.env.PORT
    }
}
