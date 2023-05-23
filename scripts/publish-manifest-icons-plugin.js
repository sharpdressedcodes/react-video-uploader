/* eslint-disable class-methods-use-this */
const fs = require('node:fs');
const path = require('node:path');

class PublishManifestIconsPlugin {
    static defaultOptions = {
        manifest: 'manifest.json',
        assetsPath: path.join(process.cwd(), './src/assets'),
    };

    constructor(options = {}) {
        this.options = {
            ...PublishManifestIconsPlugin.defaultOptions,
            ...options,
        };
    }

    apply(compiler) {
        const pluginName = PublishManifestIconsPlugin.name;

        // webpack module instance can be accessed from the compiler object,
        // this ensures that correct version of the module is used
        // (do not require/import the webpack or any symbols from it directly).
        const { webpack } = compiler;

        // Compilation object gives us reference to some useful constants.
        const { Compilation } = webpack;

        // RawSource is one of the "sources" classes that should be used
        // to represent asset sources in compilation.
        const { RawSource } = webpack.sources;

        // Tapping to the "thisCompilation" hook in order to further tap
        // to the compilation process on an earlier stage.
        compiler.hooks.thisCompilation.tap(pluginName, compilation => {
            // Tapping to the assets processing pipeline on a specific stage.
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,

                    // Using one of the later asset processing stages to ensure
                    // that all assets were already added to the compilation by other plugins.
                    // stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                    additionalAssets: true,
                },
                assets => {
                    // "assets" is an object that contains all assets
                    // in the compilation, the keys of the object are pathnames of the assets
                    // and the values are file sources.

                    // Look through assets and see if the icons listed in manifest icons are present
                    const fileNames = Object.keys(assets);
                    const manifest = fileNames.find(fileName => fileName === this.options.manifest);

                    if (manifest) {
                        const json = JSON.parse(assets[manifest].source());
                        const missingIcons = json.icons.reduce((acc, curr) => {
                            if (curr.src && !fileNames.find(fileName => fileName.endsWith(curr.src))) {
                                const file = path.join(this.options.assetsPath, curr.src);

                                if (!fs.existsSync(file)) {
                                    throw new Error(`PublishManifestIconsPlugin Error: Icon not found at ${file}`);
                                }

                                return {
                                    ...acc,
                                    [curr.src]: fs.readFileSync(file),
                                };
                            }

                            return acc;
                        }, {});

                        Object.entries(missingIcons).forEach(([key, value]) => {
                            compilation.emitAsset(key, new RawSource(value));
                        });
                    }
                },
            );
        });
    }
}

module.exports = PublishManifestIconsPlugin;
