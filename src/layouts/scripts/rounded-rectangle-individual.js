function RoundedRectangle( w, h, r, s, radiusArray ) { // width, height, radius corner, smoothness, array of radii for each vertex
		
	// helper const's
	const wi = w / 2 - r;		// inner width
	const hi = h / 2 - r;		// inner height
	const w2 = w / 2;			// half width
	const h2 = h / 2;			// half height
	const ul = r / w;			// u left
	const ur = ( w - r ) / w;	// u right
	const vl = r / h;			// v low
	const vh = ( h - r ) / h;	// v high	
	
	let positions = [
	
		 wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0
		 
	];
	
	let uvs = [
		
		ur, vh, ul, vh, ul, vl, ur, vl
		
	];
	
	let n = [
		
		3 * ( s + 1 ) + 3,  3 * ( s + 1 ) + 4,  s + 4,  s + 5,
		2 * ( s + 1 ) + 4,  2,  1,  2 * ( s + 1 ) + 3,
		3,  4 * ( s + 1 ) + 3,  4, 0
		
	];
	
	let indices = [
		
		n[0], n[1], n[2],  n[0], n[2],  n[3],
		n[4], n[5], n[6],  n[4], n[6],  n[7],
		n[8], n[9], n[10], n[8], n[10], n[11]
		
    ];
    
    let phi, cos, sin;
    let xcArray = [wi,-wi,-wi,+wi];
    let ycArray = [hi,+hi,-hi,-hi];
    let ucArray = [ur,ul,ul,ur];
    let vcArray = [vh,vh,vl,vl];
    let idx;
    
    for ( let i = 0; i < xcArray.length; i ++ ) {
        
        let xc = xcArray[i];
        let yc = ycArray[i];
        let uc = ucArray[i];
        let vc = vcArray[i];

        for ( let j = 0; j <= s; j ++ ) {
            
            phi = Math.PI / 2 * ( i + j / s ); // angle of the vertex in radians
            cos = Math.cos( phi ); // x-coordinate of the vertex on the circle
            sin = Math.sin( phi ); // y-coordinate of the vertex on the circle
            
            let radius;
            if(radiusArray && radiusArray.length > i){
                radius=radiusArray[i];
            }else{
                radius=r;
            }

            positions.push( xc + radius * cos , yc + radius * sin ,0 ); // add the vertex to the positions array

            uvs.push( uc + ul * cos , vc + vl * sin ); // add the vertex to the uvs array
                    
            if ( j < s ) {
                
                idx = ( s + 1 ) * i + j + 4;
                indices.push( i , idx , idx + 1 ); // add the indices for the triangle to the indices array
                
            }
            
        }
        
    }
    
    // create a new buffer geometry object and set its attributes and index buffer
	const geometry = new THREE.BufferGeometry( );
    geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ),1 ) );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ),3 ) );
    geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ),2 ) );
    
    return geometry;
}

AFRAME.registerComponent('rounded-plane', {
    schema: {
      width: { type: 'number', default: 1 },
      height: { type: 'number', default: 1 },
      radius: { type: 'number', default: 0.1 },
      segments: { type: 'number', default: 8 },
      radiusArray: { type: 'array', default: [] }
    },
  
    init() {
      const data = this.data;
      const el = this.el;
  
      const geometry = RoundedRectangle(
        data.width,
        data.height,
        data.radius,
        data.segments,
        data.radiusArray
      );
  
      const material = new THREE.MeshStandardMaterial({ color: '#fff' });
      const mesh = new THREE.Mesh(geometry, material);
  
      el.setObject3D('mesh', mesh);
    //   el.object3D.renderOrder = 0
    },
  
    remove() {
      this.el.removeObject3D('mesh');
    }
  });