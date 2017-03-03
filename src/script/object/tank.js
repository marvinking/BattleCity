import { Mover } from './mover';
import { res } from '../data';
import { delay } from '../comm';
import { controller } from '../control';
import { CXT_ROLE, DIR, OFFSET_X, OFFSET_Y, WHEEL_CHANGE_FREQUENT, SHIELD_CHANGE_FREQUENT, FIRE_MIN_FREQUENT, object } from '../variables';

const SHIELD_IMG = res.img.misc;
const PLAY_IMG = res.img.player;
const NPC_IMG = res.img.npc;
const WHEEL_DELAY = {count: WHEEL_CHANGE_FREQUENT};
const SHIELD_DELAY = {count: SHIELD_CHANGE_FREQUENT};

let wheelPic = 0;
let shieldPic = 0;

class Tank extends Mover {
  constructor(x, y, direction, type, index) {
    super(x, y, direction, type, index);

    this.shieldDuration = 200;

    this.fireDelay = 0;
    this.bulletAlive = false;
  }

  shield() {
    if (!this.shieldDuration) {return;}

    this.shieldDuration --;
    delay(SHIELD_DELAY, () => (shieldPic = (+!shieldPic) * 32));
    CXT_ROLE.drawImage(SHIELD_IMG, 32 + shieldPic, 0, 32, 32, this.x + OFFSET_X, this.y + OFFSET_Y, 32, 32);
  }

  // 坦克改变方向后需要重置位置
  resetPosition() {
    let x = this.x;
    let y = this.y;

    this.direction === 'W' || this.direction === 'S'
      // 此处必须使用math.round进行四舍五入才能避免坦克转弯时候位置变动过大
      ? y = Math.round(y / 16) << 4
      : x = Math.round(x / 16) << 4;

    return [x, y];
  }

  changeWheels() {
    delay(WHEEL_DELAY, () => (wheelPic = (+!wheelPic) * 32));
  }

  newBullet() {
    if (this.bulletAlive) {return;};

    controller.receiveMessage('newBullet', this.x, this.y, this.direction, 'bullet', this.index, this.grade);
    this.bulletAlive = true;
    this.fireDelay = FIRE_MIN_FREQUENT;
  }

  drawTank() {
    let img = this.type === 'player' ? PLAY_IMG : NPC_IMG;
    
    CXT_ROLE.drawImage(img, this.grade * 32, DIR[this.direction] * 64 + wheelPic, 32, 32, this.x + OFFSET_X, this.y + OFFSET_Y, 32, 32);
  }
}

export { Tank };
