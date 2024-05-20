import gsap from "https://cdn.skypack.dev/gsap"
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from "https://cdn.skypack.dev/dat.gui"
import './style.css'
const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}
gui.add(world.plane, 'width', 1, 1000).onChange(generatePlane)

gui.add(world.plane, 'height', 1, 1000).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  // vertice position randomization
  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = z + (Math.random() - 0.5) * 3
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
)
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
generatePlane()

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  frame += 0.01

  const {
    array,
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01

    // y
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes

    // vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    // vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

    // vertice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        // vertice 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })
  }
}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

        var num_rows
        var knapsackCapacity
        
        const createTable=()=> {
            knapsackCapacity = document.getElementById('capacity').value;
            num_rows = document.getElementById('rows').value;
            var theader = '<table class="table table-bordered" id="table"> <tr><th scope="col">Items</th> <th scope="col">Profit</th> <th scope="col">Weight</th></tr>';
            var tbody = '';
        
            for (var i = 0; i < num_rows; i++) {
        
                tbody += '<tbody><tr>';
                tbody += '<td>';
                tbody += 'Item ' + i
                tbody += '</td>'
                for (var j = 0; j < 2; j++) {
                    tbody += '<td>';
                    tbody += '<input type="number" class="form-control" placeholder="Value"/>'
                    tbody += '</td>'
                }
                tbody += '</tr></tbody>\n';
            }
            var tfooter = '</table>';
            document.getElementById('wrapper').innerHTML = theader + tbody + tfooter;
        }
        
        document.getElementById("cre").addEventListener('click', createTable)
        
        var kpResultantProfitId = document.getElementById("kpResultantProfit")
        var kpProfitId = document.getElementById("kpProfit")
        var kpWeightId = document.getElementById("kpWeight")
        var kpProfitWeightId = document.getElementById("kpProfitWeight")
        var kpResultantSolutionId = document.getElementById("kpResultantSolution")
        
  
        var weightValue, profitValue
        var profit = [];
        var weight = [];
        var profit_weight = []
        var tempList = []

        var i, j, knapsackResultantProfit = 0;
        
        const generateResult=()=> {
        
            knapsackCapacity = document.getElementById('capacity').value;
            num_rows = document.getElementById('rows').value;
            
            knapsackResultantProfit = 0;
            profit = [];
            weight = [];
            profit_weight = []
            tempList = []
        
            var resultClass = document.getElementsByClassName("result");
            console.log(resultClass.length);
            
            for (i = 0; i < resultClass.length; i++) {
                resultClass[i].style.visibility = "visible";
            }
        
            var tableId = document.getElementById("table")
            for (var i = 1; i <= num_rows; i++) {
                profitValue = tableId.rows[i].cells[1].children[0].value;
                profit.push(profitValue)
                tempList.push(profitValue)
                weightValue = tableId.rows[i].cells[2].children[0].value;
                weight.push(weightValue)        
            }
            
            sortLists()
             
           
            knapsackAlgorithm()
   
        
        }
        
        document.getElementById("gen").addEventListener('click', generateResult)
        function sortLists() {
        

            for (i = 0; i < num_rows; i++) {
                profit_weight[i] = (profit[i] / weight[i])
            }       
            console.log(tempList);
        
            var list = [];
            for (i = 0; i < num_rows; i++)
                list.push({ 'profit_weight': profit_weight[i], 'profit': profit[i], 'weight': weight[i] });
        
        
            list.sort(function (a, b) {
                return ((a.profit_weight > b.profit_weight) ? -1 : ((a.profit_weight == b.profit_weight) ? 0 : 1));
            });
        
            for (i = 0; i < num_rows; i++) {
                profit_weight[i] = +(list[i].profit_weight).toFixed(3)
                profit[i] = list[i].profit;
                weight[i] = list[i].weight;
            }
        }
        
        function knapsackAlgorithm() {
        
            for (i = 0; i < num_rows; i++) {
                if (weight[i] <= knapsackCapacity) {
                    knapsackCapacity -= weight[i]
                    knapsackResultantProfit += +profit[i]
                    tempList[tempList.indexOf(profit[i])] = 1
                }
                else if(knapsackCapacity != 0) {
                    knapsackResultantProfit = +knapsackResultantProfit + +(profit[i] * (knapsackCapacity / weight[i]))
                    tempList[tempList.indexOf(profit[i])] = knapsackCapacity + "/" + weight[i]
                    knapsackCapacity = 0
                }
                else {
                    tempList[tempList.indexOf(profit[i])] = 0
                }
            }
        
            kpResultantProfitId.innerHTML = +knapsackResultantProfit.toFixed(3)
            kpProfitId.innerHTML = profit
            kpWeightId.innerHTML = weight
            kpProfitWeightId.innerHTML = profit_weight
            kpResultantSolutionId.innerHTML = tempList
        }
        
        
        export default createTable;generateResult;
  