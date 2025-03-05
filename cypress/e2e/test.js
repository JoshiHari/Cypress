const myMap = new Map();
myMap.set('name', 'John');
myMap.set(42, 'Answer to Life');
myMap.set(true, 'Boolean Key');

for (let names of myMap.keys()){
    console.log(names)
}