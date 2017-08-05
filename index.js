module.exports = function crTest(dispatch) {
	
	let CID = null;
	let boss = undefined;
	let boss2 = undefined;
	let teleLocation = null;
	
	const bossId = [[471, 15], [471, 14]];
	const coordinates = [[73017, 57135, 2230], [68577.0390625,50163.55078125,2228.332275390625], [70866.28125,50381.80859375,2228.32275390625]]
	
	var bossDead = false
	
	dispatch.hook('S_LOGIN', 1, event => {
		CID = event.cid;
	})
	
	dispatch.hook('cChat', 1 , (event) => {
		if(event.message.includes('!nt')){
			dispatch.hookOnce('S_SPAWN_ME', 1, event => {
				if(coordinates[0][0] == event.x && coordinates[0][1] == event.y && coordinates[0][2] == event.z)
				{
					spawnTele();
					return false;
				}
				//console.log(event.x + ' ' + event.y + ' ' + event.z + ' ' + event.w);
				//console.log(coordinates[0][0] + ' ' + coordinates[0][1] + ' ' + coordinates[0][2]);
			})
			return false;
		}
	});
	
	dispatch.hook('S_BOSS_GAGE_INFO', 2, (event) => {
		if (event.huntingZoneId === bossId[0][0] && event.templateId === bossId[0][1]) {
			boss = event;
		}
		
		else if (event.huntingZoneId === bossId[1][0] && event.templateId === bossId[1][1]){
			boss = event;
		}

		if (boss) {
			let bossHp = bossHealth();
			if (bossHp <= 0 && bossDead == false && boss.huntingZoneId === bossId[0][0] && boss.templateId === bossId[0][1]) {
				boss = undefined;
				bossDead = true;
				bossTele(coordinates[2]);
			}
			
			else if (bossHp <= 0 && bossDead == true && boss.huntingZoneId === bossId[1][0] && boss.templateId === bossId[1][1]) {
				boss = undefined;
				bossDead = false;
				bossTele(coordinates[3]);
			}
			
		}
	 })
	 
	 	
	function bossHealth() {
		return (boss.curHp / boss.maxHp);
	}
	
	function spawnTele()
	{
		dispatch.toClient('S_SPAWN_ME', 1, {
			target: CID,
			x: coordinates[1][0],
			y: coordinates[1][1],
			z: coordinates[1][2],
			alive: 1,
			unk: 0
		})
	}
	
		function bossTele(coordinates)
	{
		teleLocation = {
			x: coordinates[0],
			y: coordinates[1],
			z: coordinates[2]
		};
		dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(teleLocation, { id: CID}))
	}
}

