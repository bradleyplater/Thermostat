describe('Thermostat', function(){

  var thermostat;

  beforeEach(function(){
    thermostat = new Thermostat;

  });

  describe('Default', function(){
    it('Has default temperature of 20', function(){
      expect(thermostat._defaultTemp).toEqual(20)
    });
  
    it('Has current set temperature to the default tempreture', function(){
      expect(thermostat.status).toEqual(thermostat._defaultTemp)
    });

    it('Can be an instance of thermostat', function(){
      expect(thermostat).toBeInstanceOf(Thermostat);
    });

  });

  describe('Increasing tempreture', function(){

    it('Can increase tempreture', function(){
      thermostat.up(10);
      expect(thermostat.status).toEqual(thermostat._defaultTemp + 10);
    });

  });

  describe('Decreasing tempreture', function(){
    
    it('Can decrease tempreture', function(){
      thermostat.down(10);
      expect(thermostat.status).toEqual(thermostat._defaultTemp - 10);
    });
  });

  describe('Minimum tempreture', function(){

    it('is 10', function(){
      expect(thermostat._minimumTemp).toEqual(10);
    });

    it('Tempreture cannot go below minimum tempreture', function(){
      expect(function() { thermostat.down(11); }).toThrowError('Cannot go below minimum temperature');
    });
  });

  describe('Powersaving mode', function(){

    it('Is on by default', function(){
      expect(thermostat.powerSaving).toEqual(true);
    });

    it('Can be turned off', function(){
      thermostat.powerSavingToggle();
      expect(thermostat.powerSaving).toEqual(false);
    });

    it('Can be turned on', function(){
      thermostat.powerSavingToggle();
      thermostat.powerSavingToggle();
      expect(thermostat.powerSaving).toEqual(true);
    });

    it('Max tempreture is 25 degrees when powersaving on', function(){
      expect(thermostat.maxTemp).toEqual(25);
    });

    it('Max tempreture is 32 degrees when powersaving off', function(){
      thermostat.powerSavingToggle();
      expect(thermostat.maxTemp).toEqual(32);
    });
  
  });

  describe('Reset', function(){

    it('Resets tempreture back to default', function(){
      thermostat.up(15);
      thermostat.reset();
      expect(thermostat.status).toEqual(thermostat._defaultTemp);
    });
  });

  describe('Energy usage', function(){

    it('Is low usage if tempreture is less than 18', function(){
      thermostat.down(5);
      expect(thermostat.usage).toEqual('low-usage');
    });

    it('Is medium usage if tempreture is in between 18 and 25', function(){
      expect(thermostat.usage).toEqual('medium-usage');
    });

    it('Is high usage if tempreture is more than 25', function(){
      thermostat.up(15);
      expect(thermostat.usage).toEqual('high-usage');
    });
  });
});
