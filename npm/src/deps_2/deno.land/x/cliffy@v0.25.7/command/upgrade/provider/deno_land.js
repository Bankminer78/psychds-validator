import { Provider } from "../provider.js";
export class DenoLandProvider extends Provider {
    name = "deno.land";
    repositoryUrl = "https://deno.land/x/";
    registryUrl = "https://deno.land/x/";
    moduleName;
    constructor({ name } = {}) {
        super();
        this.moduleName = name;
    }
    async getVersions(name) {
        const response = await fetch(`https://cdn.deno.land/${this.moduleName ?? name}/meta/versions.json`);
        if (!response.ok) {
            throw new Error("couldn't fetch the latest version - try again after sometime");
        }
        return await response.json();
    }
    getRepositoryUrl(name) {
        return new URL(`${this.moduleName ?? name}/`, this.repositoryUrl).href;
    }
    getRegistryUrl(name, version) {
        return new URL(`${this.moduleName ?? name}@${version}/`, this.registryUrl)
            .href;
    }
}
