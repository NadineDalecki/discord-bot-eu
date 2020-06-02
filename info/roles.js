const roleList = [
  {name: "lft", id : "549925842646597651"},
  {name: "Scrimmer", id : "509787093208399872"},
  {name: "Climbey", id : "428612225134231552"},
  {name: "trusted player", id : "605396047275098142"},
  {name: "bot", id : "632576070612156447"},
  
  
];
module.exports = {
  get(roleName){
    for(var role of roleList) {
      if(role.name == roleName)
      {
        return role.id;
      }
    };
    return -1;
  }
}
