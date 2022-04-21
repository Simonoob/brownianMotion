varying vec2 vUV;

uniform float uTime;
uniform vec2 uCursor;
uniform vec2 uSurfaceResolution;
uniform float uSeed;

uniform float uSpeed;


//FBM ALGO
#define NUM_OCTAVES 5

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}



//rotation

mat2 rotation2d(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, -s,
		s, c
	);
}


//color conversion
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



void main()
{
    vec2 uv = vUV/uSurfaceResolution;
    float time = uTime;
    time *= 0.0001 * uSpeed;
    vec2 mouse = uCursor/uSurfaceResolution;

    float hue = fract(mix(0.0, 1.0, time * 0.1 + uSeed));

    vec3 hsv1 = vec3(hue, 0.9, 0.85);
    vec3 hsv2 = vec3(hue + 0.07, 0.85, 0.75);

    vec3 rgb1 = hsv2rgb(hsv1);
    vec3 rgb2 = hsv2rgb(hsv2);

    vec4 color1 = vec4(rgb1, 1.0);
    vec4 color2 = vec4(rgb2, 1.0);

    float dist = distance(uv, mouse);
    float strength = smoothstep(0.5, 0.0, dist);

    // //FBM => fractional brownian motion
    // //increase noise wave while decreasxing the relevance/importance
    // float step = noise(uv * 2.0) * 0.5;
    // step+= noise(uv * 4.0) * 0.25;
    // step+= noise(uv * 8.0) * 0.125;
    // step+= noise(uv * 16.0) * 0.0625;
    // step+= noise(uv * 32.0) * 0.03125;

    float grain = rand(100.0 * uv) * mix(0.2, 0.01, strength);

    //interactivity
    vec2 movement = vec2(time * 0.1);
    movement *= rotation2d(time * 0.01);

    //FBM via algo
    float noise = fbm(uv + movement + uSeed);
    noise *= 10.0;
    noise += grain;
    noise += time;
    noise = fract(noise);

    float gap = mix(0.5, 0.01, strength);
    //get soft edges 
    float mixer = smoothstep(0.0, gap, noise) - smoothstep(1.0 - gap, 1.0, noise);


    vec4 mixedColor = mix(color1, color2, mixer);

    gl_FragColor = mixedColor;

}