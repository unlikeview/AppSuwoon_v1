uniform float time; 
uniform float progress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2; 
uniform vec4 resolution;
varying vec2 vUv; 
varying vec3 vPosition; 

float PI = 3.141592653589793238; 

vec2 mirrored(vec2 v){
  vec2 m = mod(v,2.);
  return mix(m,2.0-m,step(1.0,m));
}

float tri(float p)
{
  return mix(p,1.0-p,step(0.5,p))*2.;
}

void main() {
  vec4 t = texture2D(uTexture1,vUv);
  vec4 t1 = texture2D(uTexture2,vUv);

  //float sweep = step(distance(vUv,vec2(0.5)),progress);

  vec2 wavedUv = vec2(
    vUv.x + sin(vUv.y * 30.0) * 0.1,
    vUv.y + sin(vUv.x * 30.0) * 0.1
  );
  float sweep = smoothstep(distance(wavedUv,vec2(0.5)),distance(wavedUv,vec2(0.5))+0.1,progress);

  vec4 finalTexture = mix(t,t1,sweep);
  

  gl_FragColor =finalTexture;

}