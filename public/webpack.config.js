var path = require("path");
module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "js/bundle.js",
        path: path.resolve(__dirname, "public"),
    },
};
//# sourceMappingURL=webpack.config.js.map