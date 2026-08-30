import {
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown";

import { IMAGE } from "./markdown-image-transformer";
import { EMOJI } from "./markdown-emoji-transformer";
import { EQUATION } from "./markdown-equation-transformer";
import { HR } from "./markdown-hr-transformer";
import { TABLE } from "./markdown-table-transformer";
import { TWEET } from "./markdown-tweet-transformer";

export const CUSTOM_TRANSFORMERS = [
  IMAGE,
  EMOJI,
  EQUATION,
  HR,
  TABLE,
  TWEET,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];
