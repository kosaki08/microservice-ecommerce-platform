export default {
  "**/*.ts": (filenames) => {
    const packageDirs = new Set();
    filenames.forEach((file) => {
      const match = file.match(/apps\/[^/]+\/services\/([^/]+)/);
      if (match) packageDirs.add(`apps/rest-backend/services/${match[1]}`);
    });

    return Array.from(packageDirs).map((dir) => `pnpm run --filter ${dir} lint -- --file ${filenames.join(" --file ")}`);
  },
};
