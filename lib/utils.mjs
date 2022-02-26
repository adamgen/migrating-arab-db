import "zx/globals";

export const validateAndMakeDir = async (dir) => {
  if (!fs.pathExistsSync(dir)) {
    await $`mkdir ${dir}`;
    console.log(chalk.blue(`Created ${dir} dir`));
  } else {
    console.log(chalk.blue(`Found ${dir} dir`));
  }
};

export const protectFolders = async (...folders) => {
  for (let i = 0; i < folders.length; i++) {
    await $`chmod -w ${folders[i]}`;
  }
  console.log(chalk.blue(`Protected origin dirs [${folders.join(", ")}]`));
};
