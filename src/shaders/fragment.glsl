varying vec2 vUV;

uniform float uTime;
uniform vec2 uCursor;
uniform vec2 uSurfaceResolution;
uniform sampler2D uTexture;
uniform vec2 uTextureResolution;

uniform float uSpeed;
uniform float uBlocks;

//get right aspect ratio
vec2 getAspectRatio(vec2 uv, float surface_ratio, float texture_ratio) {
    //stretch the image as needed
    if(texture_ratio > surface_ratio) {
        //image is wider than canvas
        float ratio_diff = surface_ratio/texture_ratio;
        uv.x *= ratio_diff;
        uv.x += (1.0 - ratio_diff) / 2.0;
    } else {
        float ratio_diff = texture_ratio/surface_ratio;
        uv.y *= ratio_diff;
        uv.y += (1.0 - ratio_diff) / 2.0;
    }
    return uv;
}



//random value
void main()
{
    vec2 uv = vUV;
    float time = uTime;
    time *= 0.001 * uSpeed;

    //have a safe border around the image to distort into / zoom the image in
    uv = mix(vec2(0.1), vec2(0.9), uv);

    //get aspect ratios
    float surfaceRatio = uSurfaceResolution.x/uSurfaceResolution.y;
    float textureRatio = uTextureResolution.x/uTextureResolution.y;


    //sample block instead of individual pixel
    vec2 block = vec2(
        floor(uv.x * uBlocks)/uBlocks,
        floor(uv.y * uBlocks)/uBlocks
    );

    //Correct aspect ratio for Texture rendeding
    uv = getAspectRatio(uv, surfaceRatio, textureRatio);

    vec2 distortion = 0.1 * vec2(
        sin(time*0.3 + block.x*5.0 + block.y*2.0 + uCursor.x*2.0+uCursor.y*0.6), 
        cos(time*0.2 + block.x*5.5 + block.y*2.5 + uCursor.x*0.5+uCursor.y*1.5)
        );

    //add color
    vec4 textureColor = texture2D(uTexture, uv + distortion);

    gl_FragColor = textureColor;


}