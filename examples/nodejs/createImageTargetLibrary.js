import { OfflineCompiler } from '../../src/image-target/offline-compiler.js';

import fs, { writeFile } from 'fs/promises'
import { loadImage } from 'canvas';

//canvas.loadImage treats path as relative from where nodejs was executed, not relative to the script's location
// const imagePaths = [
//     'examples/image-tracking/assets/nsha/usa/0.jpg',
//     'examples/image-tracking/assets/nsha/usa/1.jpg',
//     'examples/image-tracking/assets/nsha/usa/2.jpg',
//     'examples/image-tracking/assets/nsha/usa/3.jpg',
//     'examples/image-tracking/assets/nsha/usa/4.jpg',
//     'examples/image-tracking/assets/nsha/usa/5.jpg',
//     'examples/image-tracking/assets/nsha/usa/6.jpg',
//     'examples/image-tracking/assets/nsha/usa/7.jpg',
//     'examples/image-tracking/assets/nsha/usa/8.jpg',
//     'examples/image-tracking/assets/nsha/usa/9.jpg',
//     'examples/image-tracking/assets/nsha/usa/10.jpg',
//     'examples/image-tracking/assets/nsha/usa/11.jpg',
//     'examples/image-tracking/assets/nsha/usa/12.jpg',
//     'examples/image-tracking/assets/nsha/usa/13.jpg',
//     'examples/image-tracking/assets/nsha/usa/14.jpg',
//     'examples/image-tracking/assets/nsha/usa/15.jpg',
//     'examples/image-tracking/assets/nsha/usa/16.jpg',
//     'examples/image-tracking/assets/nsha/usa/17.jpg',
//     'examples/image-tracking/assets/nsha/usa/18.jpg',
//     'examples/image-tracking/assets/nsha/usa/19.jpg',
// ];

const country = process.argv[2];

if(country !== "us" && country !== "mx")
    throw("Error: no se especifico un pais correcto por la variable country");

const mxRoute = "examples/image-tracking/assets/nsha/mex";
const usRoute = "examples/image-tracking/assets/nsha/usa";
const imagesRoute = country === "us" ? usRoute : mxRoute;
const imagePaths = [];

console.log("Por compilar logos de: ", imagesRoute);
const files = await fs.readdir(imagesRoute);
files.forEach((file, index) => {
    imagePaths[parseInt(file)] = `${imagesRoute}/${file}`;
});
console.log(`Se encontraron ${files.length} logos!\n`);

async function run() {
    //load all images
    const images = await Promise.all(imagePaths.map(value => loadImage(value)));
    const compiler = new OfflineCompiler();
    console.time("_matchingFeaturesFullTime");
    console.time("_extractMatchingFeatures");
    await compiler.compileImageTargets(images, (percent, i) => {
        console.log(`${i}: `, percent);
        console.timeEnd("_extractMatchingFeatures");
        console.time("_extractMatchingFeatures");
    });
    console.timeEnd("_matchingFeaturesFullTime");
    const buffer = compiler.exportData();
    await writeFile(country === "us" ? "20-logos-usa.mind" : "20-logos-mex.mind", buffer);
}

run();