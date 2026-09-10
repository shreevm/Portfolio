from pathlib import Path
import cv2
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[2]
original = Image.open(root / 'docs/images/graduation.jpeg').convert('RGB')
rgb = np.array(original)
# Trace the original subject only; no synthesis, retouching, or color changes.
outline = np.array([
    (818,439),(906,472),(889,519),(890,535),
    (895,559),(900,577),(916,589),(931,618),(940,653),
    (951,689),(960,724),(965,752),(735,752),(740,716),
    (746,683),(752,650),(760,619),(768,594),(776,584),(786,580),
    (794,560),(797,543),(799,523),(801,508),(793,503),
    (811,452)
], dtype=np.int32)
inside = np.zeros(rgb.shape[:2], dtype=np.uint8)
cv2.fillPoly(inside, [outline], 255)
kernel = np.ones((7,7), np.uint8)
mask = np.full(inside.shape, cv2.GC_BGD, dtype=np.uint8)
mask[inside > 0] = cv2.GC_PR_FGD
mask[cv2.erode(inside, kernel) > 0] = cv2.GC_FGD
cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), mask, None,
            np.zeros((1,65), np.float64), np.zeros((1,65), np.float64),
            5, cv2.GC_INIT_WITH_MASK)
alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
alpha = cv2.GaussianBlur(alpha, (3,3), 0.6)
rgba = np.dstack([rgb, alpha])
# Native-resolution crop through the waist; retain all original RGB pixels.
box = (724, 429, 976, 746)
output = Image.fromarray(rgba).crop(box)
output.save(root / 'docs/images/graduation-waist.png')
out = np.array(output)
source_crop = np.array(original.crop(box))
assert np.array_equal(out[:,:,:3], source_crop)
assert out[:,:,3].min() == 0 and out[:,:,3].max() == 255
# The face region is opaque and byte-for-byte identical to the original.
assert np.all(alpha[505:553, 817:867] == 255)
print(f'Saved {output.size}; original RGB pixels preserved; transparent background verified.')
