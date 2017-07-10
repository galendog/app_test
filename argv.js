console.log(process.argv);

console.log(process.argv.slice(2));

console.log("run from the command line is : ", require.main === module);

console.log("The filename of this module is : ", require.main.filename);
