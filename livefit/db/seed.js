/**
 * 任務 4：Seeder，種一些資料，證明你建立的資料表真的能使用。
 * 規則：可重複執行（先清空、再種入資料），即使執行多次也不會有資料疊加的狀況。
 * 執行順序：一定要先 npm run migration:run（沒有資料表，就無法種資料）
 */
const { dataSource } = require("./data-source");

/** 清空：被 FK 指著的表最後刪（先刪 COURSE，再 USER / SKILL）。
 *  不用 clear()（TRUNCATE 會被 FK 擋）、不用 delete({})（TypeORM 拒絕空條件）。 */
async function clearAll() {
  for (const name of ["Course", "User", "Skill"]) {
    if (dataSource.hasMetadata(name)) {
      await dataSource.createQueryBuilder().delete().from(name).execute();
    }
  }
}

async function main() {
  await dataSource.initialize();
  await clearAll();

  // ======================================================================
  // TODO：依照任務內容的規格寫入資料
  //   1. SKILL 三筆：重訓、瑜珈、飛輪
  //   2. USER 兩位教練，role 都為 'COACH'：
  //      海格教練（coach1@livefit.tw）、小美教練（coach2@livefit.tw）
  //   3. COURSE 四堂課：肌力入門班、週末飛輪、晨間瑜珈、核心特訓
  //      每堂課記得接上教練跟技能
  //      關聯的接法：user / skill 直接放前面存好的教練、技能物件
  //     （TypeORM 會自動取出它的 id 填進外鍵），寫法範例：
  //      courseRepo.save({ name: '...', user: 教練物件, skill: 技能物件 })
  // ======================================================================
  const skillRepo = dataSource.getRepository("Skill");
  const userRepo = dataSource.getRepository("User");
  const courseRepo = dataSource.getRepository("Course");
  const [strength, yoga, spinning] = await skillRepo.save([
    { name: "重訓" },
    { name: "瑜珈" },
    { name: "飛輪" },
  ]);
  const [coach1, coach2] = await userRepo.save([
    { role: "COACH", name: "海格教練", email: "coach1@livefit.tw" },
    { role: "COACH", name: "小美教練", email: "coach2@livefit.tw" },
  ]);
  await courseRepo.save([
    {
      name: "肌力入門班",
      description: "正確暖身和練習使用目標肌群發力",
      start_at: new Date("2026-08-20T10:00:00+08:00"),
      end_at: new Date("2026-09-20T10:00:00+08:00"),
      max_participants: 10,
      user: coach1,
      skill: strength,
    },
  ]);
  await courseRepo.save([
    {
      name: "週末飛輪",
      description: "使用飛輪達到中高強度間歇燃脂",
      start_at: new Date("2026-08-22T10:00:00+08:00"),
      end_at: new Date("2026-09-22T10:00:00+08:00"),
      max_participants: 15,
      user: coach1,
      skill: spinning,
    },
  ]);
  await courseRepo.save([
    {
      name: "晨間瑜珈",
      description: "正確暖身和練習使用目標肌群發力",
      start_at: new Date("2026-08-25T10:00:00+08:00"),
      end_at: new Date("2026-09-25T10:00:00+08:00"),
      max_participants: 10,
      user: coach2,
      skill: yoga,
    },
  ]);
  await courseRepo.save([
    {
      name: "核心特訓",
      description: "認識核心肌群，著重訓練核心發力和肌群強化",
      start_at: new Date("2026-09-01T10:00:00+08:00"),
      end_at: new Date("2026-10-01T10:00:00+08:00"),
      max_participants: 14,
      user: coach2,
      skill: strength,
    },
  ]);

  console.log("🌱 seed 完成");
  await dataSource.destroy();
}

main().catch((e) => {
  console.error("seed 失敗：", e.message);
  process.exit(1);
});
