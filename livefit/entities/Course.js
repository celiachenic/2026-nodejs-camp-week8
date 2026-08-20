//  **`COURSE`（課程）**
//   - 欄位：`name` varchar(100) 必填、
// `description` text 必填、
// `start_at` timestamp 必填、
// `end_at` timestamp 必填、
// `max_participants` integer 必填、
// `created_at`、`updated_at`（建立／更新時間，由系統自動帶入）

//   - 關聯：`user_id` → `USER`（開課教練）、
// `skill_id` → `SKILL`（課程技能）
const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Course",
  tableName: "COURSE",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    start_at: {
      type: "timestamp",
      nullable: false,
    },
    end_at: {
      type: "timestamp",
      nullable: false,
    },
    max_participants: {
      type: "integer",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
    },
    skill: {
      type: "many-to-one",
      target: "Skill",
      joinColumn: { name: "skill_id" },
    },
  },
});
