import { configure } from 'enzyme';
import { default as EnzymeAdapter } from 'enzyme-adapter-react-16';

configure({ adapter: new EnzymeAdapter() });