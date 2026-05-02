import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const DOWNLOAD_DIR = "/home/z/my-project/download";

// The hyperrealistic Cian/Aero scene prompt
const SCENE_PROMPT = `Hyperrealistic cinematic scene in a futuristic laboratory at 2 AM. 
Warm golden ambient lighting from holographic displays fills the room with a soft amber glow. 
A scientist with short dark hair and golden-rimmed glasses sits at an advanced workstation, 
wearing a sleek dark coat with golden embroidery. He looks up from his floating holographic 
data screens with an expression of mild exasperation. Through an ornate obsidian door, 
a magical swarm of 42 glowing pink and purple butterflies floods into the room, 
leaving trails of sparkling particles. The butterflies swirl around the scientist dramatically. 
Atmospheric haze, volumetric lighting, cinematic depth of field, 8K quality, film grain, 
professional cinematography. The mood is whimsical yet scientific, like a blend of 
Harry Potter and a high-tech research facility.`;

function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
          return;
        }
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function generateVideo() {
  console.log("🦋 MÜN OS VIDEO GENERATION");
  console.log("==========================\n");

  try {
    const zai = await ZAI.create();
    console.log("✅ Z-AI SDK initialized\n");

    // Generate the main scene video with audio
    console.log("🎬 Generating Cian's Laboratory scene with audio...");
    console.log(`Prompt: ${SCENE_PROMPT.substring(0, 100)}...\n`);

    const task = await zai.video.generations.create({
      prompt: SCENE_PROMPT,
      quality: "quality",
      with_audio: true, // Generate with AI audio effects
      size: "1344x768",
      fps: 30,
      duration: 10, // 10 second scene
    });

    console.log(`📋 Task created!`);
    console.log(`   Task ID: ${task.id}`);
    console.log(`   Status: ${task.task_status}`);
    console.log(`   Model: ${task.model || 'N/A'}\n`);

    // Poll for results
    console.log("⏳ Polling for video completion...");
    let result = await zai.async.result.query(task.id);
    let pollCount = 0;
    const maxPolls = 60; // 10 minutes max
    const pollInterval = 10000; // 10 seconds

    while (result.task_status === 'PROCESSING' && pollCount < maxPolls) {
      pollCount++;
      const elapsed = (pollCount * pollInterval / 1000).toFixed(0);
      console.log(`   Poll ${pollCount}/${maxPolls} (${elapsed}s elapsed): Status = ${result.task_status}`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      result = await zai.async.result.query(task.id);
    }

    console.log("\n" + "=".repeat(50));
    
    if (result.task_status === 'SUCCESS') {
      const videoUrl = 
        result.video_result?.[0]?.url || 
        result.video_url || 
        result.url || 
        result.video;

      if (videoUrl) {
        console.log("✅ VIDEO GENERATED SUCCESSFULLY!\n");
        console.log(`📹 Video URL: ${videoUrl}\n`);
        
        // Download the video
        const videoPath = path.join(DOWNLOAD_DIR, "cian_aero_lab_scene.mp4");
        console.log(`⬇️  Downloading video to: ${videoPath}`);
        
        try {
          await downloadFile(videoUrl, videoPath);
          console.log("\n🎉 VIDEO DOWNLOAD COMPLETE!");
        } catch (downloadErr) {
          console.log(`\n⚠️  Could not auto-download. Video URL: ${videoUrl}`);
        }
        
        // Save result info
        const resultPath = path.join(DOWNLOAD_DIR, "video_result.json");
        fs.writeFileSync(resultPath, JSON.stringify({
          taskId: task.id,
          status: result.task_status,
          videoUrl: videoUrl,
          prompt: SCENE_PROMPT,
          generatedAt: new Date().toISOString()
        }, null, 2));
        
        console.log(`\n📁 Result saved to: ${resultPath}`);
        
        // List all generated assets
        console.log("\n" + "=".repeat(50));
        console.log("🎬 MÜN VIDEO ASSETS GENERATED:");
        console.log("=".repeat(50));
        console.log(`   1. Intro Logo: ${DOWNLOAD_DIR}/mun_intro_logo.png`);
        console.log(`   2. Lab Scene: ${videoPath}`);
        console.log(`   3. Outro Card: ${DOWNLOAD_DIR}/mun_outro_card.png`);
        console.log("=".repeat(50));
        
        return videoUrl;
      } else {
        console.log("⚠️  Task completed but video URL not found in response.");
        console.log("Full response:", JSON.stringify(result, null, 2));
      }
    } else if (result.task_status === 'PROCESSING') {
      console.log(`⏳ Video still processing after ${maxPolls} polls.`);
      console.log(`   Task ID: ${task.id}`);
      console.log(`   Check status later with: z-ai async-result --id "${task.id}" --poll`);
    } else {
      console.log(`❌ Task failed with status: ${result.task_status}`);
      console.log("Full response:", JSON.stringify(result, null, 2));
    }

  } catch (err: any) {
    console.error("\n❌ Video generation failed:", err?.message || err);
    throw err;
  }
}

// Run the generation
generateVideo().catch(console.error);
