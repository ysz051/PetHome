/* ================= 寻宠之家 · 原型演示数据 =================
   说明：仅用于单文件原型演示，图片由文生图接口按需生成。
   正式版数据存于 MySQL，见 docs/schema.sql。 */

const PH_IMG = (prompt, size = 'landscape_4_3') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

const SEED_CATEGORIES = [
  { id: 1, name: '猫咪', icon: '🐱' },
  { id: 2, name: '狗狗', icon: '🐶' },
  { id: 3, name: '鸟类', icon: '🐦' },
  { id: 4, name: '兔子', icon: '🐰' },
  { id: 5, name: '其他', icon: '🐾' }
];

const SEED_USERS = [
  { id: 1, username: 'admin', password: 'admin123', nickname: '平台管理员', userType: 3, role: 1, phone: '13800000000', wechat: 'pethome_admin' },
  { id: 2, username: 'linxiao', password: '123456', nickname: '林晓', userType: 1, role: 0, phone: '13800000001', wechat: 'linxiao_pet' },
  { id: 3, username: 'chenmo', password: '123456', nickname: '陈默', userType: 2, role: 0, phone: '13800000002', wechat: 'chenmo_help' },
  { id: 4, username: 'wangfang', password: '123456', nickname: '王芳', userType: 1, role: 0, phone: '13800000003', wechat: 'wf_cat' },
  { id: 5, username: 'liuyang', password: '123456', nickname: '刘洋', userType: 2, role: 0, phone: '13800000004', wechat: 'ly_rescue' }
];

const SEED_POSTS = [
  /* ---------------- 寻宠启事 ---------------- */
  {
    id: 1001, channel: 'lost', userId: 2, userName: '林晓', categoryId: 1,
    title: '急寻！布偶猫「奶糖」在望京SOHO附近走失',
    petName: '奶糖', breed: '布偶猫', gender: 2, color: '海豹双色',
    features: '蓝眼睛，脖子上有粉色蝴蝶结项圈，尾巴尖端是浅灰色。性格胆小怕生，叫名字会有反应。右后腿有一小块浅色胎记。',
    time: '2026-11-12 19:30', address: '朝阳区望京SOHO T3 地下车库出口附近',
    lng: 116.4812, lat: 39.9963,
    images: [
      PH_IMG('a fluffy ragdoll cat with bright blue eyes and a pink bow collar sitting on a city sidewalk at dusk, realistic pet photography'),
      PH_IMG('close up portrait of a seal bicolor ragdoll cat with blue eyes, soft indoor light, realistic photo')
    ],
    video: '',
    contactName: '林晓', contactPhone: '138-0000-0001', contactWechat: 'linxiao_pet',
    status: 1, viewCount: 486, createTime: '2026-11-12 21:10'
  },
  {
    id: 1002, channel: 'lost', userId: 4, userName: '王芳', categoryId: 2,
    title: '三色柯基「豆豆」中关村大街走失，请大家帮忙留意',
    petName: '豆豆', breed: '柯基', gender: 1, color: '三色',
    features: '短腿，三色毛，屁股上有一块心形白色斑纹，左耳立不太起来。胆子大，喜欢追电动车，脖子上有红色反光项圈。',
    time: '2026-11-10 08:15', address: '海淀区中关村大街与丹棱街交叉口',
    lng: 116.3168, lat: 39.9832,
    images: [
      PH_IMG('a corgi dog with tricolor fur and a red reflective collar standing on a busy city street in the morning, realistic photo'),
      PH_IMG('rear view of a corgi with a heart shaped white marking, city sidewalk, realistic photography')
    ],
    video: '',
    contactName: '王芳', contactPhone: '138-0000-0003', contactWechat: 'wf_cat',
    status: 1, viewCount: 721, createTime: '2026-11-10 09:40'
  },
  {
    id: 1003, channel: 'lost', userId: 2, userName: '林晓', categoryId: 2,
    title: '金毛「大壮」在通州运河公园跑丢，会握手会坐下',
    petName: '大壮', breed: '金毛寻回犬', gender: 1, color: '金黄色',
    features: '体型偏大，毛色金黄，戴深蓝色尼龙项圈，项圈上挂着骨头形状的银色吊牌。非常亲人，会握手、坐下，听到"回家"会特别兴奋。',
    time: '2026-11-11 17:20', address: '通州区运河奥体公园 3 号门草坪',
    lng: 116.6631, lat: 39.9092,
    images: [
      PH_IMG('a large friendly golden retriever with a navy blue collar running on a green park lawn, golden hour, realistic photo'),
      PH_IMG('close up of a golden retriever dog wearing a navy collar with a bone shaped silver tag, realistic photography')
    ],
    video: '',
    contactName: '林晓', contactPhone: '138-0000-0001', contactWechat: 'linxiao_pet',
    status: 0, viewCount: 0, createTime: '2026-11-16 09:20'
  },
  {
    id: 1004, channel: 'lost', userId: 4, userName: '王芳', categoryId: 1,
    title: '英短蓝猫「灰灰」金融街走失，左耳有缺口',
    petName: '灰灰', breed: '英国短毛猫', gender: 1, color: '蓝灰色',
    features: '圆脸，蓝灰色短毛，左耳边缘有一个小缺口，尾巴很粗。已绝育，怕陌生人，但闻到罐头会主动靠近。',
    time: '2026-11-08 22:00', address: '西城区金融街购物中心北侧居民楼',
    lng: 116.3625, lat: 39.9157,
    images: [
      PH_IMG('a chubby british shorthair blue gray cat with round face sitting by an apartment building at night, realistic photo'),
      PH_IMG('portrait of a blue gray british shorthair cat with a tiny notch on its left ear, indoor lighting, realistic')
    ],
    video: '',
    contactName: '王芳', contactPhone: '138-0000-0003', contactWechat: 'wf_cat',
    status: 1, viewCount: 358, createTime: '2026-11-09 08:05'
  },
  {
    id: 1005, channel: 'lost', userId: 2, userName: '林晓', categoryId: 2,
    title: '泰迪「巧克力」方庄小区走失，穿黄色小马甲',
    petName: '巧克力', breed: '泰迪', gender: 2, color: '巧克力色',
    features: '小型犬，巧克力色卷毛，走失时穿着黄色小马甲，马甲上有反光条。刚做完造型，脚上的毛剃得比较短。',
    time: '2026-11-09 18:40', address: '丰台区方庄芳城园二区',
    lng: 116.4287, lat: 39.8653,
    images: [
      PH_IMG('a small chocolate brown toy poodle wearing a yellow vest walking in a residential compound, realistic photo'),
      PH_IMG('chocolate brown toy poodle with short trimmed legs, close up, realistic pet photography')
    ],
    video: '',
    contactName: '林晓', contactPhone: '138-0000-0001', contactWechat: 'linxiao_pet',
    status: 1, viewCount: 264, createTime: '2026-11-09 20:12'
  },
  {
    id: 1006, channel: 'lost', userId: 4, userName: '王芳', categoryId: 1,
    title: '橘猫「大橘」南锣鼓巷走失，特别贪吃',
    petName: '大橘', breed: '中华田园猫', gender: 1, color: '橘色虎斑',
    features: '体型偏胖，橘色虎斑纹，四只爪子是白色，像穿了白袜子。特别贪吃，听到塑料袋声音就会跑出来。',
    time: '2026-11-06 21:10', address: '东城区南锣鼓巷雨儿胡同',
    lng: 116.4032, lat: 39.9372,
    images: [
      PH_IMG('a chubby orange tabby cat with white paws sitting in a hutong alley in Beijing at night, realistic photo'),
      PH_IMG('close up of an orange tabby cat with white socks, warm lantern light, realistic photography')
    ],
    video: '',
    contactName: '王芳', contactPhone: '138-0000-0003', contactWechat: 'wf_cat',
    status: 1, viewCount: 902, createTime: '2026-11-07 07:30'
  },
  {
    id: 1007, channel: 'lost', userId: 5, userName: '刘洋', categoryId: 3,
    title: '虎皮鹦鹉「皮皮」后沙峪飞出窗外，会说「你好」',
    petName: '皮皮', breed: '虎皮鹦鹉', gender: 0, color: '黄绿相间',
    features: '黄绿相间羽毛，翅膀有黑色条纹，会说"你好""吃饭了"。不亲人，但听到同类叫声会回应。',
    time: '2026-11-13 07:00', address: '顺义区后沙峪裕祥花园',
    lng: 116.5352, lat: 40.1283,
    images: [
      PH_IMG('a yellow and green budgie parakeet perched on a windowsill in the morning, realistic photo'),
      PH_IMG('close up of a budgie parakeet with yellow and green feathers, soft natural light, realistic')
    ],
    video: '',
    contactName: '刘洋', contactPhone: '138-0000-0004', contactWechat: 'ly_rescue',
    status: 1, viewCount: 141, createTime: '2026-11-13 08:15'
  },
  {
    id: 1008, channel: 'lost', userId: 2, userName: '林晓', categoryId: 2,
    title: '柴犬「小八」回龙观走失，戴棕色皮项圈',
    petName: '小八', breed: '柴犬', gender: 1, color: '赤棕色',
    features: '赤棕色柴犬，白色眉毛，尾巴卷曲。戴棕色皮项圈，项圈内侧刻有手机号。性格倔，叫名字不一定理人。',
    time: '2026-11-05 16:30', address: '昌平区回龙观龙泽苑西区',
    lng: 116.3364, lat: 40.0752,
    images: [
      PH_IMG('a red shiba inu dog with a brown leather collar standing in a residential area, autumn afternoon, realistic photo'),
      PH_IMG('portrait of a shiba inu with white eyebrows and curled tail, realistic pet photography')
    ],
    video: '',
    contactName: '林晓', contactPhone: '138-0000-0001', contactWechat: 'linxiao_pet',
    status: 3, viewCount: 1183, createTime: '2026-11-05 18:00'
  },

  /* ---------------- 遇见走失宠物 ---------------- */
  {
    id: 2001, channel: 'found', userId: 3, userName: '陈默', categoryId: 2,
    title: '奥森公园南门偶遇一只戴蓝色项圈的边牧',
    breed: '边境牧羊犬', gender: 0, color: '黑白',
    features: '黑白边牧，脖子上是蓝色项圈，项圈没有吊牌。看起来很干净，应该是家养的。当时在草坪边来回跑，叫它没有停下来。',
    time: '2026-11-15 16:40', address: '朝阳区奥林匹克森林公园南门东侧草坪',
    lng: 116.3968, lat: 40.0142,
    petState: 1,
    images: [
      PH_IMG('a black and white border collie with a blue collar standing on a park lawn, autumn afternoon, realistic photo'),
      PH_IMG('border collie dog seen from a distance on a park path, blurred background, realistic photography')
    ],
    video: '',
    contactName: '陈默', contactPhone: '138-0000-0002', contactWechat: 'chenmo_help',
    status: 1, viewCount: 233, createTime: '2026-11-15 17:20'
  },
  {
    id: 2002, channel: 'found', userId: 5, userName: '刘洋', categoryId: 1,
    title: '天通苑捡到一只受伤的橘白猫，现在在我身边',
    breed: '中华田园猫', gender: 0, color: '橘白',
    features: '橘白猫，右前腿有轻微擦伤，走路有点瘸。很亲人，会主动蹭手。暂时喂了水和猫粮，状态稳定。',
    time: '2026-11-15 20:10', address: '昌平区天通苑北一区 12 号楼楼下',
    lng: 116.4185, lat: 40.0731,
    petState: 2,
    images: [
      PH_IMG('an orange and white cat with a bandaged front leg resting in a cardboard box at home, warm light, realistic photo'),
      PH_IMG('close up of an orange and white cat eating from a bowl indoors, realistic photography')
    ],
    video: '',
    contactName: '刘洋', contactPhone: '138-0000-0004', contactWechat: 'ly_rescue',
    status: 1, viewCount: 512, createTime: '2026-11-15 21:00'
  },
  {
    id: 2003, channel: 'found', userId: 3, userName: '陈默', categoryId: 2,
    title: '通州果园地铁站捡到小泰迪，已带回家暂养',
    breed: '泰迪', gender: 1, color: '棕色',
    features: '棕色小泰迪，刚剪过毛，身上很干净，没有项圈。会自己上沙发，应该在室内养大。暂时安置在我家阳台，已喂食。',
    time: '2026-11-14 19:05', address: '通州区果园地铁站 B 口',
    lng: 116.6462, lat: 39.8864,
    petState: 3,
    images: [
      PH_IMG('a small brown toy poodle sitting on a balcony at night, city lights in background, realistic photo'),
      PH_IMG('brown toy poodle wrapped in a blanket indoors, realistic pet photography')
    ],
    video: '',
    contactName: '陈默', contactPhone: '138-0000-0002', contactWechat: 'chenmo_help',
    status: 1, viewCount: 674, createTime: '2026-11-14 20:30'
  },
  {
    id: 2004, channel: 'found', userId: 5, userName: '刘洋', categoryId: 1,
    title: '望京楼道里偶遇一只蓝猫，比较警惕',
    breed: '英国短毛猫', gender: 0, color: '蓝灰',
    features: '蓝灰色短毛猫，体型偏胖，躲在 6 层楼梯间。想靠近就跑，没有看清有没有项圈。已经放了水和一点猫粮。',
    time: '2026-11-14 22:30', address: '朝阳区望京西园三区 6 号楼',
    lng: 116.4736, lat: 39.9918,
    petState: 1,
    images: [
      PH_IMG('a gray british shorthair cat hiding on a stairwell landing in an apartment building, dim light, realistic photo'),
      PH_IMG('blue gray cat peeking from behind a stair railing, realistic photography')
    ],
    video: '',
    contactName: '刘洋', contactPhone: '138-0000-0004', contactWechat: 'ly_rescue',
    status: 0, viewCount: 0, createTime: '2026-11-16 08:40'
  },
  {
    id: 2005, channel: 'found', userId: 3, userName: '陈默', categoryId: 3,
    title: '公园捡到一只玄凤鹦鹉，已带回家',
    breed: '玄凤鹦鹉', gender: 0, color: '灰黄',
    features: '灰色身体、黄色脸颊圆斑，头顶有一撮羽冠。很温顺，会站手指上。脚上有一个红色脚环，但看不清编号。',
    time: '2026-11-13 10:20', address: '海淀区紫竹院公园东门',
    lng: 116.3142, lat: 39.9421,
    petState: 3,
    images: [
      PH_IMG('a gray cockatiel with yellow cheeks perched on a finger at home, realistic photo'),
      PH_IMG('close up of a cockatiel bird with a red leg band, realistic photography')
    ],
    video: '',
    contactName: '陈默', contactPhone: '138-0000-0002', contactWechat: 'chenmo_help',
    status: 1, viewCount: 189, createTime: '2026-11-13 12:00'
  },
  {
    id: 2006, channel: 'found', userId: 5, userName: '刘洋', categoryId: 2,
    title: '小区里有只金毛在徘徊，看起来在等人',
    breed: '金毛', gender: 1, color: '金黄色',
    features: '金黄色金毛，体型偏瘦，没有项圈，毛有点打结。一直在小区门口徘徊，看到穿深色衣服的人会跟上去，可能是在等主人。',
    time: '2026-11-12 18:00', address: '大兴区亦庄林肯公园 B 区',
    lng: 116.5063, lat: 39.7952,
    petState: 2,
    images: [
      PH_IMG('a thin golden retriever wandering near a residential gate at dusk, realistic photo'),
      PH_IMG('golden retriever sitting alone by a community gate, realistic photography')
    ],
    video: '',
    contactName: '刘洋', contactPhone: '138-0000-0004', contactWechat: 'ly_rescue',
    status: 1, viewCount: 431, createTime: '2026-11-12 19:10'
  },

  /* ---------------- 领养专区 ---------------- */
  {
    id: 3001, channel: 'adopt', userId: 2, userName: '林晓', categoryId: 2,
    title: '3岁田园犬「小虎」找新家，因工作调动无法继续养',
    petName: '小虎', breed: '中华田园犬', gender: 1, age: '3岁', color: '黄褐色',
    healthStatus: '健康', sterilized: 1, vaccinated: 1,
    reason: '工作调动需要长期驻外，家里老人无法照顾，希望能找到真心喜欢它的家庭。',
    features: '性格温顺亲人，不拆家，会定点大小便，会坐下和握手。喜欢散步，和其他狗相处友好。希望领养人有稳定住所，接受回访。',
    address: '朝阳区望京', lng: 116.4812, lat: 39.9963,
    images: [
      PH_IMG('a medium sized yellow brown mongrel dog sitting in a sunny apartment, friendly expression, realistic photo'),
      PH_IMG('close up portrait of a gentle brown mixed breed dog, realistic pet photography')
    ],
    video: '',
    contactName: '林晓', contactPhone: '138-0000-0001', contactWechat: 'linxiao_pet',
    status: 1, viewCount: 388, createTime: '2026-11-11 10:20'
  },
  {
    id: 3002, channel: 'adopt', userId: 4, userName: '王芳', categoryId: 1,
    title: '1岁布偶「雪球」寻领养，家人猫毛过敏',
    petName: '雪球', breed: '布偶猫', gender: 2, age: '1岁2个月', color: '蓝双色',
    healthStatus: '健康', sterilized: 1, vaccinated: 1,
    reason: '家人确诊猫毛过敏，医生建议不要再养，非常不舍。',
    features: '性格粘人，不怕生，会主动求抱抱。爱干净，会用猫砂盆。希望领养人家中有纱窗，不散养，接受视频回访。',
    address: '西城区金融街', lng: 116.3625, lat: 39.9157,
    images: [
      PH_IMG('a fluffy blue bicolor ragdoll cat lying on a sofa, soft natural light, realistic photo'),
      PH_IMG('close up of a ragdoll cat with bright blue eyes, realistic pet photography')
    ],
    video: '',
    contactName: '王芳', contactPhone: '138-0000-0003', contactWechat: 'wf_cat',
    status: 1, viewCount: 746, createTime: '2026-11-10 15:40'
  },
  {
    id: 3003, channel: 'adopt', userId: 2, userName: '林晓', categoryId: 1,
    title: '2岁英短「元宝」找新家，因搬家无法带走',
    petName: '元宝', breed: '英国短毛猫', gender: 1, age: '2岁', color: '金渐层',
    healthStatus: '健康', sterilized: 1, vaccinated: 1,
    reason: '新租的房子不允许养宠物，找了很多地方都没办法。',
    features: '安静，不爱叫，喜欢晒太阳。有点慢热，熟悉后会主动蹭人。不挑食，用猫砂很规矩。',
    address: '海淀区上地', lng: 116.3062, lat: 40.0331,
    images: [
      PH_IMG('a golden shaded british shorthair cat sitting by a sunny window, realistic photo'),
      PH_IMG('close up of a golden british shorthair cat with round amber eyes, realistic photography')
    ],
    video: '',
    contactName: '林晓', contactPhone: '138-0000-0001', contactWechat: 'linxiao_pet',
    status: 1, viewCount: 604, createTime: '2026-11-09 11:05'
  },
  {
    id: 3004, channel: 'adopt', userId: 5, userName: '刘洋', categoryId: 1,
    title: '救助的小橘猫「年糕」找领养，约半岁',
    petName: '年糕', breed: '中华田园猫', gender: 1, age: '约6个月', color: '橘色虎斑',
    healthStatus: '健康，已驱虫', sterilized: 0, vaccinated: 1,
    reason: '在小区救助的流浪猫，家里已经有两只，实在养不下。',
    features: '活泼好动，喜欢逗猫棒，会自己用猫砂。已做体内外驱虫，第一针疫苗已打。领养需封窗，适龄绝育。',
    address: '昌平区天通苑', lng: 116.4185, lat: 40.0731,
    images: [
      PH_IMG('a playful orange tabby kitten chasing a feather toy on a living room floor, realistic photo'),
      PH_IMG('close up of a young orange tabby kitten with bright eyes, realistic pet photography')
    ],
    video: '',
    contactName: '刘洋', contactPhone: '138-0000-0004', contactWechat: 'ly_rescue',
    status: 1, viewCount: 927, createTime: '2026-11-12 09:30'
  },
  {
    id: 3005, channel: 'adopt', userId: 4, userName: '王芳', categoryId: 2,
    title: '4岁金毛「球球」寻靠谱领养，家里老人摔伤需照顾',
    petName: '球球', breed: '金毛寻回犬', gender: 1, age: '4岁', color: '深金色',
    healthStatus: '健康', sterilized: 1, vaccinated: 1,
    reason: '家里老人摔伤需要长期照顾，实在没有精力再遛狗。',
    features: '非常听话，不扑人，会和小孩相处。每天需要早晚各遛一次。希望领养人有养大型犬经验，有独立住所。',
    address: '通州区梨园', lng: 116.6631, lat: 39.8862,
    images: [
      PH_IMG('a large deep golden retriever sitting obediently in a park, realistic photo'),
      PH_IMG('portrait of a calm four year old golden retriever, realistic pet photography')
    ],
    video: '',
    contactName: '王芳', contactPhone: '138-0000-0003', contactWechat: 'wf_cat',
    status: 1, viewCount: 512, createTime: '2026-11-08 16:20'
  },
  {
    id: 3006, channel: 'adopt', userId: 3, userName: '陈默', categoryId: 2,
    title: '2岁柯基「可乐」找新家，因出国无法同行',
    petName: '可乐', breed: '柯基', gender: 2, age: '2岁', color: '三色',
    healthStatus: '健康', sterilized: 1, vaccinated: 1,
    reason: '下个月出国定居，托运风险太高，想在国内找可靠家庭。',
    features: '性格活泼，爱玩球，会自己回窝睡觉。不护食，和其他宠物相处融洽。希望领养人能接受定期视频回访。',
    address: '东城区东直门', lng: 116.4342, lat: 39.9413,
    images: [
      PH_IMG('a tricolor corgi playing with a tennis ball in a living room, realistic photo'),
      PH_IMG('close up of a happy tricolor corgi, realistic pet photography')
    ],
    video: '',
    contactName: '陈默', contactPhone: '138-0000-0002', contactWechat: 'chenmo_help',
    status: 0, viewCount: 0, createTime: '2026-11-15 22:10'
  }
];
