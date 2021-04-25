/* eslint-disable quotes,object-property-newline */
const FFMPEG_PRESETS = {
  'mp4-h264-720p': {
    ext: 'mp4',
    name: 'MP4 - H264 @ 720p',
    description: '',
    task: `ffmpeg -i $VHMC_INPUT -preset faster -crf 18 -tune zerolatency -c:v libx264 -vf format=yuv420p -vf "scale='min(1280,iw)':'min(720,ih)'" $VHMC_OUTPUT_BASE-h264-720p.mp4`,
  },
  'mp4-h264-1080p': {
    ext: 'mp4',
    name: 'MP4 - H264 @ 1080p',
    description: '',
    task: `ffmpeg -i $VHMC_INPUT -preset faster -crf 18 -tune zerolatency -c:v libx264 -vf format=yuv420p -vf "scale='min(1920,iw)':'min(1080,ih)'" $VHMC_OUTPUT_BASE-h264-1080p.mp4`,
  },
  'screenshots': {
    ext: 'jpg',
    name: 'Screenshots (720p, every 5s)',
    description: '',
    task: 'ffmpeg -i $VHMC_INPUT -r 5 -s 1280x720 -f image2 screenshot-%03d-720p.jpg'
    // 'ffmpeg -ss 00:00:02 -i $INPUT -frames:v 1 -q:v 2 $OUTPUT_BASE.jpg'
  },
  'mp3-320kbps': {
    ext: 'mp3',
    name: 'MP3 @ 320kbps',
    description: '',
    task: 'ffmpeg -i $VHMC_INPUT $VHMC_OUTPUT_BASE-320kbps.mp3'
  },

  'mp3-192kbps': {
    ext: 'mp3',
    name: 'MP3 @ 192kbps',
    description: '',
    task: 'ffmpeg -i $VHMC_INPUT $VHMC_OUTPUT_BASE-192kbps.mp3'
  },
  'mp3-128kbps': {
    ext: 'mp3',
    name: 'MP3 @ 128kbps',
    description: '',
    task: 'ffmpeg -i $VHMC_INPUT $VHMC_OUTPUT_BASE-128kbps.mp3'
  },
  'gif': {
    ext: 'gif',
    name: 'GIF',
    description: '',
    task: 'ffmpeg -i $VHMC_INPUT $VHMC_OUTPUT_BASE.gif'
  },
  // 'screenshots-watermark': {
  //   ext: 'jpg', name: 'Screenshots with watermark (720p, every 5s)', description: '',
  //   tasks: [
  //     'ffmpeg -i $VHMC_INPUT -r 5 -s 1280x720 -f image2 screenshot-%03d-720p.jpg'
  //   ]
  // },
  // 'mp4-h265-1080p': {
  //   ext: 'mp4', name: 'MP4 - H265 @ 1080p', description: ''
  // },
  // 'ogv-1080p': {
  //   ext: 'ogv', name: 'OGV @ 1080p', description: ''
  // },
  // 'webm-1080p': {
  //   ext: 'webm', name: 'WEBM @ 1080p', description: ''
  // },
  // ogg: {
  //   ext: 'ogg', name: 'OGG', description: ''
  // },
};

module.exports = FFMPEG_PRESETS;
