import "zx/globals";

export const validateAndMakeDir = async (dir) => {
  if (!fs.pathExistsSync(dir)) {
    await $`mkdir ${dir}`;
    console.log(chalk.blue(`Created ${dir} dir`));
  } else {
    console.log(chalk.blue(`Found ${dir} dir`));
  }
};
