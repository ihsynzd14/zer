const moduleFileName = "remoteEntry.js";

// Remote module
const arkModule = {
  fileName: moduleFileName,
  name: "omnichannel_ark",
  get url() {
    return `//omnichannel-fe-ark-library.lab.sml.sit.g4c.unicredit.eu`;
  },
  get federationConfig() {
    // app2@[window.app2Url]/remoteEntry.js
    return `${this.name}@${this.url}/${this.fileName}`;
  }
};

const styleguideModule = {
  fileName: moduleFileName,
  name: "omnichannel_styleguide",
  get url() {
    return `//omnichannel-fe-styleguide-library.lab.sml.sit.g4c.unicredit.eu`;
  },
  get federationConfig() {
    // app2@[window.app2Url]/remoteEntry.js
    return `${this.name}@${this.url}/${this.fileName}`;
  }
};

module.exports = {
  arkModule,
  styleguideModule
};
