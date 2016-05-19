var mongoose = require('mongoose');

module.exports = mongoose.model('Garage', {
	name:                   { type: String,  default: 'My Garage' },
	description:            { type: String,  default: 'N/A'       },
	dateAdded:              { type: Date,    default: Date.now    },
	actualState:            { type: String,  default: 'Closed'    },
	actualStateChangeTime:  { type: Date,    default: Date.now    },
	desiredStateChangeTime: { type: Date,    default: Date.now    },
	desiredState:           { type: String,  default: 'Closed'    },
	active:                 { type: Boolean, default: false       },
	username:               { type: String,  default: ''          }
});